const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class UserFriendsUtils extends _Row {
    constructor(databaseWrapper) {
        super("user_friends", databaseWrapper, "user_id");
    }

    addUser(user_id, username, friends = {}) {
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} (user_id, username, friends)
                                        VALUES (?, ?, ?);`, [user_id, username, JSON.stringify(friends)]);
    }

    addFriendByUsername(username1, username2) {
        let row1 = this.databaseWrapper.run_query(`SELECT user_id, friends
                                                   FROM user_friends
                                                            INNER JOIN accounts
                                                                       ON user_friends.user_id = accounts.user_id AND accounts.username = ?`, [username1]);
        row1["friends"][username2] = { "blocked": false };
        this._updateColumn("user_id", row1["user_id"], row1["friends"]);

        let row2 = this.databaseWrapper.run_query(`SELECT user_id, friends
                                                   FROM user_friends
                                                            INNER JOIN accounts
                                                                       ON user_friends.user_id = accounts.user_id AND accounts.username = ?`, [username2]);
        row2["friends"][username1] = { "blocked": false };
        this._updateColumn("user_id", row2["user_id"], row2["friends"]);
    }

    blockUser(username1, username2) {
        let row = this.databaseWrapper.run_query(`SELECT user_id, friends
                                                   FROM user_friends
                                                            INNER JOIN accounts
                                                                       ON user_friends.user_id = accounts.user_id AND accounts.username = ?`, [username1]);

        row["friends"][username2]["blocked"] = true;
        this._updateColumn("user_id", row["user_id"], row["friends"]);
    }
}

module.exports = UserFriendsUtils;
