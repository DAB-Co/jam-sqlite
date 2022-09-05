const path = require("path");
const setup = require(path.join(__dirname, "setup.js"));
const assert = require("assert");

const jam_sqlite = setup.jam_sqlite;
const YoutubeUtils = jam_sqlite.Utils.YoutubeUtils;

describe(__filename, function() {
    let database = undefined;
    let accounts = undefined;
    let youtubeUtils = undefined;
    before(function() {
        database = setup.create_database();
        accounts = setup.register_accounts(database, 2);
        youtubeUtils = new YoutubeUtils(database);
    });

    describe("", function() {
        it("test getAllPrimaryKeys", function () {
            // maybe will be moved to a seperate file later on
            let res = youtubeUtils.getAllPrimaryKeys();
            assert.ok(res !== undefined && res.length === 2, res.indexOf(1) !== -1 && res.indexOf(2) !== -1);
        });
    });

    describe("", function() {
        it("update refresh token for user 1", function () {
            youtubeUtils.updateRefreshToken(1, "refresh_token");
        });
    });

    describe("", function() {
        it("no refresh token for user 2", function () {
            assert.strictEqual(youtubeUtils.getRefreshToken(2), null);
        });
    });

    describe("", function() {
        it("refresh token is added properly for user 1", function () {
            assert.strictEqual(youtubeUtils.getRefreshToken(1), "refresh_token");
        });
    });

    describe("", function () {
        it("update refresh token for user 1", function () {
            youtubeUtils.updateRefreshToken(1, "updated_token");
        });
    });

    describe("", function () {
        it("refresh token is updated properly for user 1", function () {
            assert.strictEqual(youtubeUtils.getRefreshToken(1), "updated_token");
        });
    });

    describe("", function () {
        it("delete refresh token test", function () {
            youtubeUtils.deleteRefreshToken("1");

            let pref = youtubeUtils.getRefreshToken("1");
            assert.strictEqual(pref,undefined);
        });
    });
});
