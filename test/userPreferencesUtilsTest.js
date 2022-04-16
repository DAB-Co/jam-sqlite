const path = require("path");
const setup = require(path.join(__dirname, "setup.js"));
const assert = require("assert");

const jam_sqlite = setup.jam_sqlite;
const UserPreferencesUtils = jam_sqlite.Utils.UserPreferencesUtils;

describe(__filename, function () {
    let database = undefined;
    let accounts = undefined;
    let userPreferencesUtils = undefined;

    before(function () {
        database = setup.create_database();
        accounts = setup.register_accounts(database, 3);
        userPreferencesUtils = new UserPreferencesUtils(database);
    });

    describe("", function () {
        it("test addPreference and getPreference", function () {
            userPreferencesUtils.addPreference(1, "pid1", 10);
            let pref = userPreferencesUtils.getPreference(1, "pid1");
            assert.strictEqual(pref.user_id, 1);
            assert.strictEqual(pref.preference_identifier, "pid1");
            assert.strictEqual(pref.preference_weight, 10);
        });
    });

    describe("", function () {
        it("fail to add same preference with same type and id again for the same user", function () {
            let error_occured = false;
            try {
                userPreferencesUtils.addPreference(1, "pid1", 31);
            } catch (e) {
                assert.strictEqual(e.code, "SQLITE_CONSTRAINT_TRIGGER");
                error_occured = true;
            }
            assert.ok(error_occured);
        });
    });

    describe("", function () {
        it("can add user with the same id same preference type but different preference id", function () {
            let error_occured = false;
            try {
                userPreferencesUtils.addPreference(1, "pid2", 31);
            } catch (e) {
                assert.strictEqual(e.code, "SQLITE_CONSTRAINT_TRIGGER");
                error_occured = true;
            }
            assert.ok(!error_occured);
        });
    });

    describe("", function () {
        it("fail to add user with the same id same preference id but different preference type", function () {
            let error_occured = false;
            try {
                userPreferencesUtils.addPreference(1, "pid1", 31);
            } catch (e) {
                assert.strictEqual(e.code, "SQLITE_CONSTRAINT_TRIGGER");
                error_occured = true;
            }
            assert.ok(error_occured);
        });
    });

    describe("", function () {
        it("add same preference with same type and id again for different user", function () {
            let error_occured = false;
            try {
                userPreferencesUtils.addPreference(2, "pid1", 31);
            } catch (e) {
                assert.strictEqual(e.code, "SQLITE_CONSTRAINT_TRIGGER");
                error_occured = true;
            }
            assert.ok(!error_occured);
        });
    });

    describe("", function () {
        it("test updatePreferenceWeight", function () {
            userPreferencesUtils.updatePreferenceWeight(1, "pid1", 31);
            let pref = userPreferencesUtils.getPreference(1, "pid1");
            assert.strictEqual(pref.user_id, 1);
            assert.strictEqual(pref.preference_identifier, "pid1");
            assert.strictEqual(pref.preference_weight, 31);
        });
    });

    describe("", function () {
        it("test removing preference", function () {
            userPreferencesUtils.removePreference(1, "pid2");
            assert.strictEqual(userPreferencesUtils.getPreference(1, "pid2"), undefined);
        });
    });

    describe("", function () {
        it("test removing preference from nonexistent user", function () {
            userPreferencesUtils.removePreference(23, "pid2");
        });
    });

    describe("", function () {
        it("test removing nonexistent preference from existent user", function () {
            userPreferencesUtils.removePreference(1, "pid111");
        });
    });

    describe("", function () {
        it("test removing nonexistent preference from nonexistent user", function () {
            // not sure if this is too different from the test 2 above it...
            userPreferencesUtils.removePreference(1234, "pid318470");
        });
    });

    describe("", function () {
        it("test getUserPreferenceIds", function () {
            let pref1 = userPreferencesUtils.getUserPreferenceIds(1);
            assert.strictEqual(pref1.length, 1);
            assert.strictEqual(pref1[0], "pid1");
            let pref2 = userPreferencesUtils.getUserPreferenceIds(1);
            assert.strictEqual(pref2.length, 1);
            assert.strictEqual(pref2[0], "pid1");
        });
    });

    describe("", function () {
        it("test getUserPreferences", function () {
            let pref1 = userPreferencesUtils.getUserPreferences(1);
            assert.strictEqual(pref1.length, 1);
            assert.strictEqual(pref1[0].preference_identifier, "pid1");
            assert.strictEqual(pref1[0].preference_weight, 31);
            let pref2 = userPreferencesUtils.getUserPreferences(1);
            assert.strictEqual(pref2.length, 1);
            assert.strictEqual(pref2[0].preference_identifier, "pid1");
            assert.strictEqual(pref2[0].preference_weight, 31);
        });
    });

    describe("", function () {
        it("test getCommonUserIds", function () {
            let res = userPreferencesUtils.getCommonUserIds("pid1");
            let valids = {
                1: true,
                2: true,
            }
            assert.strictEqual(res.length, 2);
            for (let i = 0; i < res.length; i++) {
                assert.ok(res[i] in valids);
            }
        });
    });

    describe("", function() {
       it("test getCommonUsers", function() {
           let res = userPreferencesUtils.getCommonUsers("pid1");
           let valids = {
               1: 31,
               2: 31,
           }
           assert.strictEqual(res.length, 2);
           for (let i = 0; i < res.length; i++) {
               assert.ok(res[i].user_id in valids);
               assert.strictEqual(res[i].preference_weight, valids[res[i].user_id]);
           }
       });
    });

    describe("", function() {
       it("test getCommonPreferences", function() {
           userPreferencesUtils.addPreference(3, "pid2", 69);
           userPreferencesUtils.addPreference(2, "pid2", 61);
           userPreferencesUtils.updatePreferenceWeight(2, "pid1", 32);
           let res = userPreferencesUtils.getAllCommonPreferences();
           let valids = {
               pid1: [[ '1', 31], ['2', 32 ]],
               pid2: [['3', 69 ], ['2', 61]]
           };
           assert.strictEqual(Object.keys(res).length, 2);
           for (let [p, val] of res) {
               assert.ok(p in valids);
               assert.strictEqual(JSON.stringify(res[p]), JSON.stringify(valids[p]));
           }
       });
    });
});