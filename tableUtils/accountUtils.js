class AccountUtils{
    constructor(databaseWrapper) {
        this.databaseWrapper = databaseWrapper;
    }

    // Returns true if username exists
    usernameExists = function (username) {
        let result = this.databaseWrapper.get("SELECT * FROM accounts WHERE username = ?;", [username]);
        return !!result; // return false if undefined
    };

    // Creates a user in user table with given username and password
    addUser = function (username, pass) {
        return this.databaseWrapper.run_query("INSERT INTO accounts (username, password) VALUES (?, ?);", [username, pass]);
    };

    // Returns password of a user by username
    getPassword = function (username) {
        let result = this.databaseWrapper.get("SELECT password FROM accounts WHERE username = ?;", [username]);
        return result.password;
    };
}

module.exports = AccountUtils;