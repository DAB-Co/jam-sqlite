const path = require("path");
const jam_sqlite = require(path.join(__dirname, "..", "main.js"));
const database_scripts = jam_sqlite.database_scripts;
const fs = require("fs");
const db_dir = path.join(__dirname, "..", "sqlite");
const db_path = path.join(db_dir, "database.db");

/**
 *
 * @returns {Promise<Database>}
 */
async function setup_database() {
    try {
        fs.unlinkSync(db_path);
    } catch (e) {
        if (e.code !== "ENOENT") {
            throw e;
        }
    }

    await database_scripts.create_database(db_dir, "database.db");
    return new jam_sqlite.Database(db_path);
}

/**
 *
 * @param database
 * @param count
 * @returns {json} {"email": `user${i}@email.com`,
            "username": `user${i}`,
            "password": "12345678",
            "api_token": "api_token",}
 */
function register_accounts(database, count) {
    const accountUtils = new jam_sqlite.Utils.AccountUtils(database);
    const accounts = {};
    for (let i=1; i<=count; i++) {
        let user = {
            "email": `user${i}@email.com`,
            "username": `user${i}`,
            "password": "12345678",
            "api_token": "api_token",
        };
        accountUtils.addUser(user.email, user.username, user.password, user.api_token);
        accounts[i] = user;
    }
    return accounts;
}

module.exports = {
    setup_database: setup_database,
    register_accounts: register_accounts,
    jam_sqlite: jam_sqlite,
}
