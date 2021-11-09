class AccountUtils{
    constructor(databaseWrapper) {
        this.databaseWrapper = databaseWrapper;
    }

    // Returns true if username exists
    usernameExists = async function (username) {
        let result = databaseWrapper.get("SELECT * FROM accounts WHERE username = ?;", [username]);
        return result.length != 0;
    };

    // Creates a user in user table with given username and password
    addUser = function (username, pass) {
        return databaseWrapper.run_query("INSERT INTO accounts (username, password) VALUES (?, ?);", [username, pass]);
    };

    // Returns password of a user by username
    getPassword = async function (username) {
        let result = databaseWrapper.get("SELECT password FROM accounts WHERE username = ?;", [username]);
        return result[0].password;
    };
}
