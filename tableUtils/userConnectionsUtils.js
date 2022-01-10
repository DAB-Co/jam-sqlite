const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"));

class UserConnectionsUtils extends _Row {
    /**
     *
     * @param database
     */
    constructor(database) {
        super("user_connections", database);
    }

    /**
     * id order doesn't matter
     *
     * @param user1_id
     * @param user2_id
     * @returns {boolean}
     */
    connectionExists(user1_id, user2_id) {
        return this.databaseWrapper.get(`SELECT * FROM ${this.table_name} WHERE (user1_id=? AND user2_id=?) OR (user1_id=? AND user2_id=?)`, [user1_id, user2_id, user2_id, user1_id]) !== undefined;
    }

    /**
     *
     * @param user1_id
     * @param user2_id
     */
    addConnection(user1_id, user2_id) {
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} (user1_id, user2_id) VALUES (?,?)`, [user1_id, user2_id]);
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
        let result = this.databaseWrapper.get_all(`SELECT user1_id, user2_id FROM ${this.table_name} WHERE matched == 0 AND weight != 0 AND (user1_id=? OR user2_id=?) ORDER BY weight DESC LIMIT 1`, [user_id, user_id]);
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
}

module.exports = UserConnectionsUtils;
