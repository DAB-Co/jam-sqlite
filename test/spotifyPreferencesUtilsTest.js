const path = require("path");
const setup = require(path.join(__dirname, "setup.js"));
const assert = require("assert");

const jam_sqlite = setup.jam_sqlite;
const SpotifyPreferencesUtils = jam_sqlite.Utils.SpotifyPreferencesUtils;
const UserPreferencesUtils = jam_sqlite.Utils.UserPreferencesUtils;

describe(__filename, function () {
    let database = undefined;
    let accounts = undefined;
    let userPreferencesUtils = undefined;
    let spotifyPreferencesUtils = undefined;

    before(function () {
        database = setup.create_database();
        accounts = setup.register_accounts(database, 2);
        userPreferencesUtils = new UserPreferencesUtils(database);
        spotifyPreferencesUtils = new SpotifyPreferencesUtils(database);
    });

    describe("", function () {
        it("get nonexistent preference", function () {
            let pref = spotifyPreferencesUtils.get_preference("sigma male");
            assert.strictEqual(pref, undefined);
        });
    });

    describe("", function () {
        it("add preference for user 1", function () {
            userPreferencesUtils.addPreference(1, "video tape", "sabrina eats cake", 31);
            let pref = spotifyPreferencesUtils.get_preference("sabrina eats cake");
            assert.strictEqual(pref.preference_id, "sabrina eats cake");
            assert.strictEqual(pref.type, "video tape");
            assert.strictEqual(pref.images, null);
            assert.strictEqual(pref.name, null);
        });
    });

    describe("", function () {
        it("add preference for user 2", function () {
            userPreferencesUtils.addPreference(2, "recording", "dinner with paul allen", 69);
            let pref = spotifyPreferencesUtils.get_preference("dinner with paul allen");
            assert.strictEqual(pref.preference_id, "dinner with paul allen");
            assert.strictEqual(pref.type, "recording");
            assert.strictEqual(pref.images, null);
            assert.strictEqual(pref.name, null);
        });
    });

    describe("", function () {
        it("update sabrina eats cake name", function () {
            spotifyPreferencesUtils.update_preference("sabrina eats cake", "prn", "sabrina loves cake", JSON.stringify({"image": "i"}));
            let pref = spotifyPreferencesUtils.get_preference("sabrina eats cake");
            assert.strictEqual(pref.preference_id, "sabrina eats cake");
            assert.strictEqual(pref.type, "prn");
            assert.strictEqual(pref.images, JSON.stringify({"image": "i"}));
            assert.strictEqual(pref.name, "sabrina loves cake");
        });
    })
});
