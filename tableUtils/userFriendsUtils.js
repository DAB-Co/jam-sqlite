const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

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
        let row1 = this.databaseWrapper.get(`SELECT accounts.username, friends
                                                   FROM user_friends
                                                            INNER JOIN accounts
                                                                       ON user_friends.user_id = accounts.user_id AND user_friends.user_id = ?`, [id1]);

        if (row1 === undefined) {
            return;
        }

        let row2 = this.databaseWrapper.get(`SELECT accounts.username, friends
                                                   FROM user_friends
                                                            INNER JOIN accounts
                                                                       ON user_friends.user_id = accounts.user_id AND user_friends.user_id = ?`, [id2]);

        if (row2 === undefined) {
            return;
        }

        let friends1 = JSON.parse(row1["friends"]);
        friends1[id2] = { "username": row2["username"], "blocked": false };
        this.updateColumnByPrimaryKey(id1, "friends", JSON.stringify(friends1));

        let friends2 = JSON.parse(row2["friends"]);
        friends2[id1] = { "username": row1["username"], "blocked": false };
        this.updateColumnByPrimaryKey(id2, "friends", JSON.stringify(friends2));
    }

    /**
     * one way block from id1 to id2, will do nothing if id1 doesn't exist
     *
     * @param id1
     * @param id2
     */
    blockUser(id1, id2) {
        let res = this.getColumnByPrimaryKey(id1, "friends");
        if (res === undefined || res === null || res === '') {
            return;
        }
        let friends = JSON.parse(res);
        if (friends !== undefined && id2 in friends) {
            friends[id2]["blocked"] = true;
            this.updateColumnByPrimaryKey(id1, "friends", JSON.stringify(friends));
        }
    }

    /**
     *
     * @param id1
     * @param id2
     */
    unblockUser(id1, id2) {let res = this.getColumnByPrimaryKey(id1, "friends");
        if (res === undefined || res === null || res === '') {
            return;
        }
        let friends = JSON.parse(res);
        if (friends !== undefined && id2 in friends) {
            friends[id2]["blocked"] = false;
            this.updateColumnByPrimaryKey(id1, "friends", JSON.stringify(friends));
        }
    }

    /**
     *
     * @param id
     * @returns {undefined | json} {id1: {blocked: true}, id2: {blocked: true}}
     */
    getFriends(id) {
        let res = this.getColumnByPrimaryKey(id, "friends");
        if (res === undefined) {
            return undefined;
        }
        else {
            return JSON.parse(res);
        }
    }

    /**
     * 
     * @param user_id 
     */
    deleteFriend(user_id) {
        this.databaseWrapper.run_query(`DELETE FROM ${this.table_name} WHERE ${this.primary_key} = ?`,[user_id])
    }
}

module.exports = UserFriendsUtils;
