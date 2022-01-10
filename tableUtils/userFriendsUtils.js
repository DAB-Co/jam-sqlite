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
     *
     * @param user_id
     * @param friends
     */
    addUser(user_id, friends = {}) {
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} (user_id, friends)
                                        VALUES (?, ?);`, [user_id, JSON.stringify(friends)]);
    }

    /**
     *
     * @param id1
     * @param id2
     */
    addFriend(id1, id2) {
        let row1 = this.databaseWrapper.get(`SELECT accounts.username, friends
                                                   FROM user_friends
                                                            INNER JOIN accounts
                                                                       ON user_friends.user_id = accounts.user_id AND user_friends.user_id = ?`, [id1]);

        let row2 = this.databaseWrapper.get(`SELECT accounts.username, friends
                                                   FROM user_friends
                                                            INNER JOIN accounts
                                                                       ON user_friends.user_id = accounts.user_id AND user_friends.user_id = ?`, [id2]);

        let friends1 = JSON.parse(row1["friends"]);
        friends1[id2] = { "username": row2["username"], "blocked": false };
        this.updateColumnByPrimaryKey(id1, "friends", JSON.stringify(friends1));

        let friends2 = JSON.parse(row2["friends"]);
        friends2[id1] = { "username": row1["username"], "blocked": false };
        this.updateColumnByPrimaryKey(id2, "friends", JSON.stringify(friends2));
    }

    /**
     *
     * @param id1
     * @param id2
     */
    blockUser(id1, id2) {
        let friends = JSON.parse(this.getColumnByPrimaryKey(id1, "friends"));
        friends[id2]["blocked"] = true;
        this.updateColumnByPrimaryKey(id1, "friends", JSON.stringify(friends));
    }

    /**
     *
     * @param id
     * @returns {undefined | json} {id1: {blocked: true}, id2: {blocked: true}}
     */
    getFriends(id) {
        let res = this.getColumnByPrimaryKey(id, "friends");
        if (res === undefined) {
            return undefined
        }
        else {
            return JSON.parse(res);
        }
    }
}

module.exports = UserFriendsUtils;
