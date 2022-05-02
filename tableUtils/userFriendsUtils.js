const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"));

class UserFriendsUtils extends _Row {
    /**
     *
     * @param databaseWrapper
     */
    constructor(databaseWrapper) {
        super("user_friends", databaseWrapper, "user_id");
    }

    /**
     * will do nothing if any one of the users don't exist
     *
     * @param id1
     * @param id2
     */
    addFriend(id1, id2) {
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} (user_id, friend_id)
                                        VALUES (?, ?);`, [id1, id2]);
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} (user_id, friend_id)
                                        VALUES (?, ?);`, [id2, id1]);
    }

    /**
     * one way block from id1 to id2, will do nothing if id1 doesn't exist
     *
     * @param id1
     * @param id2
     */
    blockUser(id1, id2) {
        this.databaseWrapper.run_query(
            `UPDATE ${this.table_name}
             SET blocked= TRUE
             WHERE user_id = ?
               AND friend_id = ?;`
            , [id1, id2]);
    }

    /**
     *
     * @param id1
     * @param id2
     */
    unblockUser(id1, id2) {
        this.databaseWrapper.run_query(
            `UPDATE ${this.table_name}
             SET blocked= FALSE
             WHERE user_id = ?
               AND friend_id = ?;`
            , [id1, id2]);
    }

    /**
     *
     * @param id
     * @returns {json} {id1: {username: username1, blocked: true}, id2: {username: username2, blocked: true}},
     */
    getFriends(id) {
        let raw_res = this.databaseWrapper.get_all(`
            SELECT friend_id, blocked, username
            FROM user_friends F
                     JOIN accounts A ON F.friend_id = A.user_id
            WHERE F.user_id = ?;`, [id]);
        let result = {};
        for (let i of raw_res) {
            result[i["friend_id"]] = {
                "username": i["username"],
                "blocked": Boolean(i["blocked"]),
            };
        }
        return result;
    }

    /**
     * Deletes user_id from friends table both from user_id and friend_id
     * @param user_id
     */
    deleteFriend(user_id) {
        this.databaseWrapper.run_query(`DELETE
                                        FROM ${this.table_name}
                                        WHERE ${this.primary_key} = ?`, [user_id])
    }
}

module.exports = UserFriendsUtils;
