const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"));
const UserLanguagesUtils = require(path.join(__dirname, "userLanguagesUtils.js"));

class UserConnectionsUtils extends _Row {
    /**
     *
     * @param database
     */
    constructor(database) {
        super("user_connections", database);
        this.userLanguagesUtils = new UserLanguagesUtils(database);
    }

    /**
     * will throw error for duplicates
     *
     * @param user1_id
     * @param user2_id
     * @param weight
     * @param {boolean} matched
     */
    addConnection(user1_id, user2_id, weight = 0, matched = false) {
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} (user1_id, user2_id, weight, matched)
                                        VALUES (?, ?, ?, ?)`, [user1_id, user2_id, weight, matched ? 1 : 0]);
    }

    /**
     * id order doesn't matter
     *
     * @param user1_id
     * @param user2_id
     * @returns {number|undefined}
     */
    getWeight(user1_id, user2_id) {
        let res = this.databaseWrapper.get(`SELECT weight
                                            FROM ${this.table_name}
                                            WHERE (user1_id = ? AND user2_id = ?)
                                               OR (user1_id = ? AND user2_id = ?)`, [user1_id, user2_id, user2_id, user1_id]);
        if (res === undefined) {
            return undefined;
        } else {
            return res.weight;
        }
    }

    /**
     * id order doesn't matter, however connection must already exist in the database
     *
     * use addConnection if the connection is new
     *
     * @param user1_id
     * @param user2_id
     * @param weight
     * @param {boolean} matched
     */
    updateConnection(user1_id, user2_id, weight, matched = false) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name}
                                        SET weight=?,
                                            matched=?
                                        WHERE (user1_id = ? AND user2_id = ?)
                                           OR (user1_id = ? AND user2_id = ?)`, [weight, matched ? 1 : 0, user1_id, user2_id, user2_id, user1_id]);
    }

    /**
     *
     * @param user_id
     * @returns {undefined | number}
     */
    getNewMatch(user_id) {
        let can_speak = this.userLanguagesUtils.getUserCanSpeakWith(user_id);
        // the query will have two parts
        // (user1_id=? AND (user2_id=? OR user2_id=?...)) OR (user2_id=? AND (user1_id=? OR user1_id=?...))
        let q1 = "(user1_id=? AND(";
        for (let i = 0; i < can_speak.length; i++) {
            q1 += "user2_id=?"
            if (i !== can_speak.length - 1) {
                q1 += " OR "
            }
        }
        q1 += "))";
        let q2 = "(user2_id=? AND("
        for (let i = 0; i < can_speak.length; i++) {
            q2 += "user1_id=?"
            if (i !== can_speak.length - 1) {
                q2 += " OR "
            }
        }
        q2 += "))";
        if (can_speak.length === 0) {
            return undefined;
        }
        let final_query = `SELECT user1_id, user2_id
                           FROM ${this.table_name}
                           WHERE matched = 0
                             AND weight != 0
                             AND (${q1} OR ${q2})
                           ORDER BY weight DESC
                           LIMIT 1`;
        let result = this.databaseWrapper.get_all(final_query, [user_id, ...can_speak, user_id, ...can_speak]);
        if (result === undefined || result === null || result.length === 0) {
            return undefined;
        } else {
            let pair = result[0];
            if (pair.user1_id === user_id) {
                return pair.user2_id;
            } else {
                return pair.user1_id;
            }
        }
    }

    /**
     * id order doesn't matter
     *
     * @param user1_id
     * @param user2_id
     */
    finalizeMatch(user1_id, user2_id) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name}
                                        SET matched=1
                                        WHERE (user1_id = ? AND user2_id = ?)
                                           OR (user1_id = ? AND user2_id = ?)`, [user1_id, user2_id, user2_id, user1_id]);
    }

    /**
     *
     * @param user1_id
     * @param user2_id
     * @returns {number|undefined}
     */
    getMatched(user1_id, user2_id) {
        let res = this.databaseWrapper.get(`SELECT matched
                                            FROM ${this.table_name}
                                            WHERE (user1_id = ? AND user2_id = ?)
                                               OR (user1_id = ? AND user2_id = ?)`, [user1_id, user2_id, user2_id, user1_id]);
        if (res === undefined) {
            return undefined;
        } else {
            return res.matched;
        }
    }

    /**
     *
     * @param user_id
     */
    deleteMatched(user_id) {
        this.databaseWrapper.run_query(`DELETE
                                        FROM ${this.table_name}
                                        WHERE user1_id = ?
                                           OR user2_id = ?`, [user_id, user_id])
    }

    dump(graph, matched) {
        let dump_data = new Map();

        for (let [u1, edges] of graph) {
            for (let [u2, weight] of edges) {
                if (!dump_data.has(u1)) {
                    dump_data.set(u1, new Map());
                }

                dump_data.get(u1).set(u2, {weight: weight, matched_flag: matched.has(u1) && matched.get(u1).has(u2)});

                if (!dump_data.has(u2)) {
                    dump_data.set(u2, new Map());
                }


                dump_data.get(u2).set(u1, {weight: weight, matched_flag: matched.has(u2) && matched.get(u2).has(u1)});
            }
        }

        for (let [u1, matches] of matched) {
            for (let u2 of matches) {
                if (!dump_data.has(u1)) {
                    dump_data.set(u1, new Map());
                }

                dump_data.get(u1).set(u2, {weight: graph.has(u1) && graph.get(u1).has(u2) ? graph.get(u1).get(u2) : 0, matched_flag: matched.has(u1) && matched.get(u1).has(u2)});

                if (!dump_data.has(u2)) {
                    dump_data.set(u2, new Map());
                }


                dump_data.get(u2).set(u1, {weight: graph.has(u2) && graph.get(u2).has(u1) ? graph.get(u2).get(u1) : 0, matched_flag: matched.has(u2) && matched.get(u2).has(u1)});
            }
        }

        for (let [u1, edges] of dump_data) {
            for (let [u2, {weight, matched_flag}] of edges) {
                try {
                    this.addConnection(u1, u2, weight, matched_flag);
                } catch (e) {
                    if (e.message === 'this connection exists') {
                        this.updateConnection(u1, u2, weight, matched_flag);
                    } else {
                        throw e;
                    }
                }
            }
        }
    }

    load() {
        let matched = new Map();
        let graph = new Map();

        let iterator = this.getTableIterator();

        for (const row of iterator) {
            const u1 = row.user1_id;
            const u2 = row.user2_id;
            const weight = row.weight;
            const matched_flag = row.matched;
            if (!graph.has(u1)) {
                graph.set(u1, new Map());
            }

            graph.get(u1).set(u2, weight);

            if (!graph.has(u2)) {
                graph.set(u2, new Map());
            }

            graph.get(u2).set(u1, weight);

            if (matched_flag === 1) {
                if (!matched.has(u1)) {
                    matched.set(u1, new Set());
                }

                matched.get(u1).add(u2);

                if (!matched.has(u2)) {
                    matched.set(u2, new Set());
                }

                matched.get(u2).add(u1);
            }
        }

        return {graph: graph, matched: matched};
    }
}

module.exports = UserConnectionsUtils;
