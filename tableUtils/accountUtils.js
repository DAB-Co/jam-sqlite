const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class AccountUtils extends _Row{
    constructor(databaseWrapper) {
        super("accounts", databaseWrapper, "user_id");
    }

    // Returns true if username exists
    usernameExists = function (username) {
        let result = this.databaseWrapper.get("SELECT * FROM accounts WHERE username = ?;", [username]);
        return !!result; // return false if undefined
    };

    // Creates a user in user table with given username and password
    addUser = function (username, pass) {
        return this.databaseWrapper.run_query("INSERT INTO accounts (username, user_password) VALUES (?, ?);", [username, pass]);
    };

    // Returns password of a user by username
    getPassword = function (username) {
        let result = this.databaseWrapper.get("SELECT user_password FROM accounts WHERE username = ?;", [username]);
        return result.password;
    };
}

module.exports = AccountUtils;