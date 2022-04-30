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

    describe("", function () {
        it("user name exist test", function () {
            let pref = accountUtils.usernameExists("user1");
            assert.strictEqual(pref,true);
        });
    });

    describe("", function () {
        it("email exist test", function () {
            let pref = accountUtils.emailExists("user1@email.com");
            assert.strictEqual(pref,true);
        });
    });

    describe("", function () {
        it("add user test", function () {
            accountUtils.addUser("user3@email.com","user3","12345678","api_token");
            let pref = accountUtils.usernameExists("user3");
            assert.strictEqual(pref,true);
        });
    });

    describe("", function () {
        it("add user with notification token test", function () {
            accountUtils.addUserWithNotificationToken("user4@email.com","user4", "password","api_token","notification_token");
            let pref = accountUtils.usernameExists("user4");
            assert.strictEqual(pref,true);
        });
    });

    describe("", function () {
        it("get password hash test", function () {
            let pref = accountUtils.getPasswordHash(1);
            assert.strictEqual(pref,"12345678");
        });
    });

    describe("", function () {
        it("get user name by id test", function () {
            let pref = accountUtils.getUsernameById(1);
            assert.strictEqual(pref,"user1");
        });
    });

    describe("", function () {
        it("get row by email test", function () {
            let pref = accountUtils.getRowByEmail("user5@email.com");
            assert.strictEqual(pref,undefined);
        });
    });

    describe("", function () {
        it("get notification token test", function () {
            let pref = accountUtils.getNotificationToken(1);
            assert.strictEqual(pref,null);
        });
    });

    describe("", function () {
        it("update notification token test", function () {
            accountUtils.updateNotificationToken(1,"test");
            let pref = accountUtils.getNotificationToken(1);
            assert.strictEqual(pref,"test");
        });
    });

    describe("", function () {
        it("update notification token by user name test", function () {
            accountUtils.updateNotificationTokenByUsername("user1","NewToken");
            let pref = accountUtils.getNotificationToken(1);
            assert.strictEqual(pref,"NewToken");
        });
    });

    describe("", function () {
        it("get id by user name test", function () {
            let pref = accountUtils.getIdByUsername("user1");
            assert.strictEqual(pref,1);
        });
    });

    describe("", function () {
        it("get api token test", function () {
            let pref = accountUtils.getApiToken(1);
            assert.strictEqual(pref,"api_token");
        });
    });

    describe("", function () {
        it("update tokens test", function () {
            accountUtils.updateTokens(1,"api_token","notification_token");
            let pref1 = accountUtils.getApiToken(1);
            let pref2 = accountUtils.getNotificationToken(1);
            assert.strictEqual(pref1,"api_token");
            assert.strictEqual(pref2,"notification_token");
        });
    });

    describe("", function () {
        it("clear tokens test", function () {
            accountUtils.clearTokens(1);
            let pref1 = accountUtils.getApiToken(1);
            let pref2 = accountUtils.getNotificationToken(1);
            assert.strictEqual(pref1,"");
            assert.strictEqual(pref2,"");
        });
    });

    describe("", function () {
        it("delete user test", function () {
            accountUtils.deleteUser(1);
            let pref = accountUtils.getUsernameById(1);
            assert.strictEqual(pref,undefined);
        });
    });
});