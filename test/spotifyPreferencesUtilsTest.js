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
            userPreferencesUtils.addPreference(1, "sabrina eats cake", 31);
            let pref = spotifyPreferencesUtils.get_preference("sabrina eats cake");
            assert.strictEqual(pref.preference_id, "sabrina eats cake");
            assert.strictEqual(pref.type, null);
            assert.strictEqual(JSON.stringify(pref.images), JSON.stringify([]));
            assert.strictEqual(pref.name, null);
        });
    });

    describe("", function () {
        it("add preference for user 2", function () {
            userPreferencesUtils.addPreference(2, "dinner with paul allen", 69);
            let pref = spotifyPreferencesUtils.get_preference("dinner with paul allen");
            assert.strictEqual(pref.preference_id, "dinner with paul allen");
            assert.strictEqual(pref.type, null);
            assert.strictEqual(JSON.stringify(pref.images), JSON.stringify([]));
            assert.strictEqual(pref.name, null);
        });
    });

    describe("", function () {
        it("update sabrina eats cake name", function () {
            spotifyPreferencesUtils.update_preference("sabrina eats cake", "prn", "sabrina loves cake", [{"image": "i"}]);
            let pref = spotifyPreferencesUtils.get_preference("sabrina eats cake");
            assert.strictEqual(pref.preference_id, "sabrina eats cake");
            assert.strictEqual(pref.type, "prn");
            assert.strictEqual(JSON.stringify(pref.images), JSON.stringify([{"image": "i"}]));
            assert.strictEqual(pref.name, "sabrina loves cake");
        });
    });

    describe("", function () {
        it("add another preference for user 1 and test get_preferences", function () {
            userPreferencesUtils.addPreference(1, "hip to be square", 13);
            let prefs = spotifyPreferencesUtils.get_preferences(userPreferencesUtils.getUserPreferences(1));
            let assumed_prefs = {
                "sabrina eats cake": {
                    type: "prn",
                    name: "sabrina loves cake",
                    images: [{
                        "image": "i",
                    }]
                },
                "hip to be square": {
                    type: null,
                    name: null,
                    images: [],
                }
            }

            assert.ok(prefs.length > 0);
            for (let i = 0; i < prefs.length; i++) {
                let pref = prefs[i];
                let id = pref.preference_id;
                let assumed_pref = assumed_prefs[id];
                assert.ok(id in assumed_prefs);
                assert.strictEqual(pref.type, assumed_pref.type);
                assert.strictEqual(pref.name, assumed_pref.name);
                assert.strictEqual(JSON.stringify(pref.images), JSON.stringify(assumed_pref.images));
            }
        });
    });

    describe("", function () {
        it("update_images test", function () {
            let error_occured = false;
            try {
                spotifyPreferencesUtils.update_images("sabrina eats cake", '[{}]');
            } catch (e) {
                error_occured = true;
            }
            assert.ok(error_occured);

            spotifyPreferencesUtils.update_images("sabrina eats cake", [{"i succ": "zucc"}]);
            let pref = spotifyPreferencesUtils.get_preference("sabrina eats cake");
            assert.strictEqual(pref.preference_id, "sabrina eats cake");
            assert.strictEqual(pref.type, "prn");
            assert.strictEqual(JSON.stringify(pref.images), JSON.stringify([{"i succ": "zucc"}]));
            assert.strictEqual(pref.name, "sabrina loves cake");
        });
    });

    describe("", function () {
        it("update name test", function () {
            spotifyPreferencesUtils.update_name("sabrina eats cake", "chunky chocolate cake");

            let pref = spotifyPreferencesUtils.get_preference("sabrina eats cake");
            assert.strictEqual(pref.preference_id, "sabrina eats cake");
            assert.strictEqual(pref.type, "prn");
            assert.strictEqual(JSON.stringify(pref.images), JSON.stringify([{"i succ": "zucc"}]));
            assert.strictEqual(pref.name, "chunky chocolate cake");
        });
    });

    describe("", function () {
        it("update type test", function () {
            spotifyPreferencesUtils.update_type("sabrina eats cake", "extra chunky");

            let pref = spotifyPreferencesUtils.get_preference("sabrina eats cake");
            assert.strictEqual(pref.preference_id, "sabrina eats cake");
            assert.strictEqual(pref.type, "extra chunky");
            assert.strictEqual(JSON.stringify(pref.images), JSON.stringify([{"i succ": "zucc"}]));
            assert.strictEqual(pref.name, "chunky chocolate cake");
        });
    });
});
