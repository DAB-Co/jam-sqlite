const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"));

class UserPreferencesUtils extends _Row {
    /**
     *
     * @param database
     */
    constructor(database) {
        super("user_preferences", database);
    }

    /**
     * add new preference to the database
     *
     * @param user_id
     * @param preference_identifier
     * @param preference_weight
     */
    addPreference(user_id, preference_identifier, preference_weight) {
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name}
                                            (user_id, preference_identifier, preference_weight)
                                        VALUES (?, ?, ?)`,
            [user_id, preference_identifier, preference_weight]);
    }

    /**
     * get specific preference data for a user
     *
     * @param user_id
     * @param preference_identifier
     * @returns {json | undefined} {
        "user_id",
        "preference_identifier",
        "preference_weight",}
     */
    getPreference(user_id, preference_identifier) {
        return this.databaseWrapper.get(`SELECT *
                                         FROM ${this.table_name}
                                         WHERE user_id = ?
                                           AND preference_identifier = ?`,
            [user_id, preference_identifier]);
    }

    /**
     * remove preference from database
     *
     * @param user_id
     * @param preference_identifier
     */
    removePreference(user_id, preference_identifier) {
        this.databaseWrapper.run_query(`DELETE
                                        FROM ${this.table_name}
                                        WHERE user_id = ?
                                          AND preference_identifier = ?`, [user_id, preference_identifier]);
    }

    /**
     * update preference type weight and preference identifier weight
     *
     * @param user_id
     * @param preference_identifier
     * @param preference_weight
     */
    updatePreferenceWeight(user_id, preference_identifier, preference_weight) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name}
                                        SET preference_weight=?
                                        WHERE user_id = ?
                                          AND preference_identifier = ?`,
            [preference_weight, user_id, preference_identifier]);
    }

    /**
     * get common user ids for a given preference
     *
     * @param preference_identifier
     * @returns {number[]} user ids
     */
    getCommonUserIds(preference_identifier) {
        // `GROUP BY user_id` is not needed because triggers do not allow duplicates while insertion
        let res = this.databaseWrapper.get_all(`SELECT user_id
                                                FROM ${this.table_name}
                                                WHERE preference_identifier = ?`, [preference_identifier]);
        if (res === undefined || res.length === 0) {
            return [];
        } else {
            let ret_val = [];
            for (let i = 0; i < res.length; i++) {
                ret_val.push(res[i].user_id);
            }
            return ret_val;
        }
    }

    /**
     * get common user ids and weights for a given preference
     *
     * @param preference_identifier
     * @returns {JSON[]} [{user_id, preference_weight}, ...]
     */
    getCommonUsers(preference_identifier) {
        // `GROUP BY user_id` is not needed because triggers do not allow duplicates while insertion
        let res = this.databaseWrapper.get_all(`SELECT user_id, preference_weight
                                                FROM ${this.table_name}
                                                WHERE preference_identifier = ?`, [preference_identifier]);
        if (res === undefined || res.length === 0) {
            return [];
        } else {
            return res;
        }
    }

    /**
     *
     * @param user_id
     * @returns {JSON[]} [{preference_identifier, preference_weight}, ...]
     */
    getUserPreferences(user_id) {
        if (user_id === undefined) {
            return [];
        }

        let res = this.databaseWrapper.get_all(`SELECT preference_identifier, preference_weight
                                                FROM ${this.table_name}
                                                WHERE user_id = ?`, user_id);

        if (res === undefined || res.length === 0) {
            return [];
        } else {
            return res;
        }
    }

    /**
     *
     * @param user_id
     * @returns {string[]} preference identifiers
     */
    getUserPreferenceIds(user_id) {
        if (user_id === undefined) {
            return [];
        }

        let res = this.databaseWrapper.get_all(`SELECT preference_identifier
                                                FROM ${this.table_name}
                                                WHERE user_id = ?`, user_id);

        if (res === undefined || res.length === 0) {
            return [];
        } else {
            let ret_val = [];
            for (let i = 0; i < res.length; i++) {
                ret_val.push(res[i].preference_identifier);
            }
            return ret_val;
        }
    }

    /**
     *
     * @param user_id 
     */
    deleteUserPreference(user_id) {
        this.databaseWrapper.run_query(`DELETE FROM ${this.table_name} WHERE user_id=?`,user_id)
    }

    /**
     * get all common preferences
     *
     * @returns {Map} {preference_identifier: {user_id: preference_weight, ...}, ...}
     */
    getAllCommonPreferences() {
        let res = this.databaseWrapper.get_all(`SELECT GROUP_CONCAT(user_id),
                                                       preference_identifier,
                                                       GROUP_CONCAT(preference_weight)
                                                FROM ${this.table_name}
                                                GROUP BY preference_identifier`);

        if (res === undefined) {
            return new Map();
        } else {
            let ret_val = new Map();
            for (let i=0; i<res.length; i++) {
                ret_val[res[i].preference_identifier] = new Map();
                let user_ids = res[i]['GROUP_CONCAT(user_id)'].split(',');
                let preference_weights = res[i]['GROUP_CONCAT(preference_weight)'].split(',');
                for (let j=0; j<user_ids.length; j++) {
                    let curr_weight = parseInt(preference_weights[j]);
                    ret_val[res[i].preference_identifier].set(user_ids[j],curr_weight);
                }
            }
            return ret_val;
        }
    }
}

module.exports = UserPreferencesUtils;
