const path = require("path");
const setup = require(path.join(__dirname, "setup.js"));
const assert = require("assert");

const jam_sqlite = setup.jam_sqlite;
const SpotifyUtils = jam_sqlite.Utils.SpotifyUtils;

describe(__filename, function() {
    let database = undefined;
    let accounts = undefined;
    let spotifyUtils = undefined;
    before(function() {
        database = setup.create_database();
        accounts = setup.register_accounts(database, 2);
        spotifyUtils = new SpotifyUtils(database);
    });

    describe("", function() {
        it("update refresh token for user 1", function () {
            spotifyUtils.updateRefreshToken(1, "refresh_token");
        });
    });

    describe("", function() {
        it("no refresh token for user 2", function () {
            assert.strictEqual(spotifyUtils.getRefreshToken(2), '');
        });
    });

    describe("", function() {
        it("refresh token is added properly for user 1", function () {
            assert.strictEqual(spotifyUtils.getRefreshToken(1), "refresh_token");
        });
    });

    describe("", function () {
        it("update refresh token for user 1", function () {
            spotifyUtils.updateRefreshToken(1, "updated_token");
        });
    });

    describe("", function () {
       it("refresh token is updated properly for user 1", function () {
           assert.strictEqual(spotifyUtils.getRefreshToken(1), "updated_token");
       });
    });
});
