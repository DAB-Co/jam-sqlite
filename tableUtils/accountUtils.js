const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class AccountUtils extends _Row {
    constructor(databaseWrapper) {
        super("accounts", databaseWrapper, "user_id");
    }

    // Returns true if username exists
    usernameExists = function (username) {
        let result = this.databaseWrapper.get("SELECT * FROM accounts WHERE username = ?;", [username]);
        return !!result; // return false if undefined
    };

    emailExists(email) {
        let result = this.databaseWrapper.get("SELECT * FROM accounts WHERE user_email = ?;", [email]);
        return !!result; // return false if undefined
    }

    // Creates a user in user table with given username and password
    addUser = function (email, username, pass) {
        return this.databaseWrapper.run_query("INSERT INTO accounts (user_email, username, user_password_hash) VALUES (?, ?, ?);", [email, username, pass]);
    };

    // Creates a user in user table with given username and password
    addUserWithToken = function (email, username, pass, token) {
        return this.databaseWrapper.run_query("INSERT INTO accounts (user_email, username, user_password_hash, notification_token) VALUES (?, ?, ?, ?);", [email, username, pass, token]);
    };

    getEmail(username) {
        return this.databaseWrapper.get("SELECT user_email FROM accounts WHERE username = ?;", [username]);
    }

    // Returns password of a user by username, returns empty string if username does not exist
    getPasswordFromUsername = function (username) {
        let result = this.databaseWrapper.get("SELECT user_password_hash FROM accounts WHERE username = ?;", [username]);
        if (!result) return "";
        return result["user_password_hash"];
    };

    getUsername(id) {
        return this.get_row(id)["username"];
    }

    getUsernameAndPass = function (email) {
        let result = this.databaseWrapper.get("SELECT user_password_hash, username FROM accounts WHERE user_email = ?;", [email]);
        return result;
    }

    getNotificationToken(username) {
        let result = this.databaseWrapper.get("SELECT notification_token FROM accounts WHERE username = ?;", [username]);
        return result["notification_token"];
    }

    updateNotificationToken(username, newToken) {
        return this.databaseWrapper.run_query("UPDATE accounts SET notification_token = ? WHERE username = ?;", [newToken, username]);
    }
}

module.exports = AccountUtils;