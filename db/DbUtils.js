const path = require("path");
const Database = require(path.join(__dirname, "Database.js"));

class DbUtils {
    constructor(database) {
        this.database = database;
    }

    // Returns true if username exists
    async usernameExists (username) {
        let result = await this.database.run_query("SELECT * FROM accounts WHERE username = ?;", [username]);
        return result.length !== 0;
    }

    // Creates a user in user table with given username and password
    addUser (username, pass) {
        return this.database.run_query("INSERT INTO accounts (username, password) VALUES (?, ?);", [username, pass]);
    }

    // Returns password of a user by username
    async getPassword (username) {
        let result = await this.database.run_query("SELECT password FROM accounts WHERE username = ?;", [username]);
        return result[0].password;
    }
}

module.exports = DbUtils;
