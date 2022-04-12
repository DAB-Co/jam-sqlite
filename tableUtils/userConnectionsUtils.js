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
     *
     * @param user1_id
     * @param user2_id
     * @param weight
     */
    addConnection(user1_id, user2_id, weight=0) {
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} (user1_id, user2_id, weight) VALUES (?,?,?)`, [user1_id, user2_id, weight]);
    }

    /**
     * id order doesn't matter
     *
     * @param user1_id
     * @param user2_id
     * @returns {number|undefined}
     */
    getWeight(user1_id, user2_id) {
        let res = this.databaseWrapper.get(`SELECT weight FROM ${this.table_name} WHERE (user1_id=? AND user2_id=?) OR (user1_id=? AND user2_id=?)`, [user1_id, user2_id, user2_id, user1_id]);
        if (res === undefined) {
            return undefined;
        }
        else {
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
     */
    updateConnection(user1_id, user2_id, weight) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET weight=? WHERE (user1_id=? AND user2_id=?) OR (user1_id=? AND user2_id=?)`, [weight, user1_id, user2_id, user2_id, user1_id]);
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
        for (let i=0; i<can_speak.length; i++) {
            q1 += "user2_id=?"
            if (i !== can_speak.length-1) {
                q1 += " OR "
            }
        }
        q1 += "))";
        let q2 = "(user2_id=? AND("
        for (let i=0; i<can_speak.length; i++) {
            q2 += "user1_id=?"
            if (i !== can_speak.length-1) {
                q2 += " OR "
            }
        }
        q2 += "))";
        if (can_speak.length === 0) {
            return undefined;
        }
        let final_query = `SELECT user1_id, user2_id FROM ${this.table_name} WHERE matched = 0 AND weight != 0 AND (${q1} OR ${q2}) ORDER BY weight DESC LIMIT 1`;
        let result = this.databaseWrapper.get_all(final_query, [user_id, ...can_speak, user_id, ...can_speak]);
        if (result === undefined || result === null || result.length === 0) {
            return undefined;
        }
        else {
            let pair = result[0];
            if (pair.user1_id === user_id) {
                return pair.user2_id;
            }
            else {
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
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET matched=1 WHERE (user1_id=? AND user2_id=?) OR (user1_id=? AND user2_id=?)`, [user1_id, user2_id, user2_id, user1_id]);
    }

    /**
     * 
     * @param user1_id 
     * @param user2_id 
     * @returns {number|undefined}
     */
    getMatched(user1_id,user2_id) {
        let res = this.databaseWrapper.get(`SELECT matched FROM ${this.table_name} WHERE (user1_id=? AND user2_id=?) OR (user1_id=? AND user2_id=?)`, [user1_id, user2_id, user2_id, user1_id]);
        if (res === undefined) {
            return undefined;
        }
        else {
            return res.matched;
        }
    }

    /**
     * 
     * @param user_id 
     */
    deleteMatched(user_id) {
        this.databaseWrapper.run_query(`DELETE FROM ${this.table_name} WHERE user1_id=? OR user2_id=?`, [user_id])
    }
}

module.exports = UserConnectionsUtils;
