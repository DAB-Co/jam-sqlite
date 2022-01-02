const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class UserFriendsUtils extends _Row {
    constructor(databaseWrapper) {
        super("user_friends", databaseWrapper, "user_id");
    }

    addUser(user_id, friends = {}) {
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} (user_id, friends)
                                        VALUES (?, ?);`, [user_id, JSON.stringify(friends)]);
    }

    addFriendByUsername(username1, username2) {
        let row1 = this.databaseWrapper.get(`SELECT user_friends.user_id, friends
                                                   FROM user_friends
                                                            INNER JOIN accounts
                                                                       ON user_friends.user_id = accounts.user_id AND accounts.username = ?`, [username1]);

        let friends1 = JSON.parse(row1["friends"]);
        friends1[username2] = { "blocked": false };
        this._updateColumn("user_id", row1["user_id"], "friends", JSON.stringify(friends1));

        let row2 = this.databaseWrapper.get(`SELECT user_friends.user_id, friends
                                                   FROM user_friends
                                                            INNER JOIN accounts
                                                                       ON user_friends.user_id = accounts.user_id AND accounts.username = ?`, [username2]);
        let friends2 = JSON.parse(row2["friends"]);
        friends2[username1] = { "blocked": false };
        this._updateColumn("user_id", row2["user_id"], "friends", JSON.stringify(friends2));
    }

    blockUser(username1, username2) {
        let row = this.databaseWrapper.get(`SELECT user_friends.user_id, friends
                                                   FROM user_friends
                                                            INNER JOIN accounts
                                                                       ON user_friends.user_id = accounts.user_id AND accounts.username = ?`, [username1]);

        let friends = JSON.parse(row["friends"]);
        friends[username2]["blocked"] = true;
        this._updateColumn("user_id", row["user_id"], "friends", JSON.stringify(friends));
    }

    getFriendsByUsername(username) {
        let row = this.databaseWrapper.get(`SELECT friends
                                                   FROM user_friends
                                                            INNER JOIN accounts
                                                                       ON user_friends.user_id = accounts.user_id AND accounts.username = ?`, [username]);
        if (row !== undefined && "friends" in row) {
            return JSON.parse(row["friends"]);
        }
        else {
            return undefined;
        }
    }
}

module.exports = UserFriendsUtils;
