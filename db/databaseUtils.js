const path = require("path");
const DatabaseWrapper = require(path.join(__dirname, "databaseWrapper.js"));

class DatabaseUtils {
    constructor(database_path) {
        this.databaseWrapper = new DatabaseWrapper(database_path);
    }

    // Creates a user in user table with given username and password
    addUser (username, pass) {
        return this.databaseWrapper.run_query("INSERT INTO accounts (username, password) VALUES (?, ?);", [username, pass]);
    }

    // Returns password of a user by username
    async getPassword (username) {
        let result = await this.databaseWrapper.get_matching("SELECT password FROM accounts WHERE username = ?;", [username]);
        if (result.length > 0) {
            return result[0].password;
        }
        else {
            return null;
        }
    }
}

module.exports = DatabaseUtils;
