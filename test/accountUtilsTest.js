const path = require("path");
const setup = require(path.join(__dirname, "setup.js"));
const assert = require("assert");

const jam_sqlite = setup.jam_sqlite;
const AccountUtils = jam_sqlite.Utils.AccountUtils;

describe(__filename, function () {
    let database = undefined;
    let accounts = undefined;
    let accountUtils = undefined;

    before(function () {
        database = setup.create_database();
        accounts = setup.register_accounts(database, 2);
        accountUtils = new AccountUtils(database);
    });

    
});