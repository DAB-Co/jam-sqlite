const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class AccountUtils extends _Row {
    constructor(databaseWrapper) {
        super("accounts", databaseWrapper, "user_id");
    }

    // Returns true if username exists
    usernameExists = function (username) {
        let result = this._getRow("username", username);
        return result !== undefined;
    };

    emailExists(email) {
        let result = this._getRow("user_email", email);
        return result !== undefined;
    }

    // Creates a user in user table with given username and password
    addUser = function (email, username, pass) {
        this.databaseWrapper.run_query("INSERT INTO accounts (user_email, username, user_password_hash) VALUES (?, ?, ?);", [email, username, pass]);
    };

    // Creates a user in user table with given username and password
    addUserWithToken = function (email, username, pass, token) {
        this.databaseWrapper.run_query("INSERT INTO accounts (user_email, username, user_password_hash, user_notification_token) VALUES (?, ?, ?, ?);", [email, username, pass, token]);
    };

    getEmailByUsername(username) {
        return this._getColumn("username", username, "user_email");
    }

    // Returns password of a user by username, returns empty string if username does not exist
    getPasswordFromUsername = function (username) {
        return this._getColumn("username", username, "user_password");
    };

    getUsernameById(id) {
        return this.getColumnByPrimaryKey(id, "username");
    }

    getUsernameAndPassByEmail = function (email) {
        let row = this._getRow("user_email", email);
        return row;
    }

    getNotificationTokenByUsername(username) {
        return this._getColumn("username", username, "user_notification_token");
    }

    updateNotificationTokenByUsername(username, newToken) {
        this._updateColumn("username", username, "user_notification_token", newToken);
    }
}

module.exports = AccountUtils;