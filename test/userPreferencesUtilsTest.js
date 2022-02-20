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
            userPreferencesUtils.addPreference(1, "ptype1", "pid1", 10);
            let pref = userPreferencesUtils.getPreference(1, "ptype1", "pid1");
            assert.strictEqual(pref.user_id, 1);
            assert.strictEqual(pref.preference_type, "ptype1");
            assert.strictEqual(pref.preference_identifier, "pid1");
            assert.strictEqual(pref.preference_weight, 10);
        });
    });

    describe("", function () {
        it("fail to add same preference with same type and id again for the same user", function () {
            let error_occured = false;
            try {
                userPreferencesUtils.addPreference(1, "ptype1", "pid1", 31);
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
                userPreferencesUtils.addPreference(1, "ptype1", "pid2", 31);
            } catch (e) {
                assert.strictEqual(e.code, "SQLITE_CONSTRAINT_TRIGGER");
                error_occured = true;
            }
            assert.ok(!error_occured);
        });
    });

    describe("", function () {
        it("can add user with the same id same preference id but different preference type", function () {
            let error_occured = false;
            try {
                userPreferencesUtils.addPreference(1, "ptype2", "pid1", 31);
            } catch (e) {
                assert.strictEqual(e.code, "SQLITE_CONSTRAINT_TRIGGER");
                error_occured = true;
            }
            assert.ok(!error_occured);
        });
    });

    describe("", function () {
        it("add same preference with same type and id again for different user", function () {
            let error_occured = false;
            try {
                userPreferencesUtils.addPreference(2, "ptype1", "pid1", 31);
            } catch (e) {
                assert.strictEqual(e.code, "SQLITE_CONSTRAINT_TRIGGER");
                error_occured = true;
            }
            assert.ok(!error_occured);
        });
    });

    describe("", function () {
        it("test updatePreferenceWeight", function () {
            userPreferencesUtils.updatePreferenceWeight(1, "ptype1", "pid1", 31);
            let pref = userPreferencesUtils.getPreference(1, "ptype1", "pid1");
            assert.strictEqual(pref.user_id, 1);
            assert.strictEqual(pref.preference_type, "ptype1");
            assert.strictEqual(pref.preference_identifier, "pid1");
            assert.strictEqual(pref.preference_weight, 31);
        });
    });

    describe("", function () {
        it("test removing preference", function () {
            userPreferencesUtils.removePreference(1, "ptype1", "pid2");
            assert.strictEqual(userPreferencesUtils.getPreference(1, "ptype1", "pid2"), undefined);
        });
    });

    describe("", function () {
        it("test getCommonPreferenceIds", function () {
            userPreferencesUtils.addPreference(1, "ptype3", "pid3");
            userPreferencesUtils.addPreference(2, "ptype3", "pid3");
            userPreferencesUtils.addPreference(1, "ptype3", "pid5");
            userPreferencesUtils.addPreference(2, "ptype3", "pid5");
            let res = userPreferencesUtils.getCommonPreferenceIds([1, 2], "ptype3");
            let valids = {
                "pid3": true,
                "pid5": true,
            }
            assert.strictEqual(res.length, 2);
            for (let i = 0; i < res.length; i++) {
                assert.ok(res[i] in valids);
            }
        });
    });

    describe("", function () {
        it("test getCommonPreferenceIds with different type", function () {
            let res = userPreferencesUtils.getCommonPreferenceIds([1, 2], "ptype4");
            let valids = {
                "pid3": true,
                "pid5": true,
            }
            assert.strictEqual(res.length, 0);
        });
    });

    describe("", function () {
        it("test getCommonUserIds", function () {
            userPreferencesUtils.addPreference(1, "ptype32", "pid1", 33);
            userPreferencesUtils.addPreference(2, "ptype31", "pid1", 33);
            userPreferencesUtils.addPreference(3, "ptype31", "pid1", 31);
            let res = userPreferencesUtils.getCommonUserIds("ptype31", "pid1");
            let valids = {
                2: true,
                3: true,
            }
            assert.strictEqual(res.length, 2);
            for (let i = 0; i < res.length; i++) {
                assert.ok(res[i] in valids);
            }
        });
    });
});