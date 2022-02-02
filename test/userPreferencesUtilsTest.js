const path = require("path");
const setup = require(path.join(__dirname, "setup.js"));
const assert = require("assert");

const jam_sqlite = setup.jam_sqlite;
const UserPreferencesUtils = jam_sqlite.Utils.UserPreferencesUtils;

describe(__filename, function() {
    let database = undefined;
    let accounts = undefined;
    let userPreferencesUtils = undefined;

    before(function(){
        database = setup.create_database();
        accounts = setup.register_accounts(database, 3);
        userPreferencesUtils = new UserPreferencesUtils(database);
    });

    describe("", function() {
        it("test addPreference and getPreference", function() {
            userPreferencesUtils.addPreference(1, "ptype1", "pid1", 10, 20);
            let pref = userPreferencesUtils.getPreference(1, "ptype1", "pid1");
            assert.strictEqual(pref.user_id, 1);
            assert.strictEqual(pref.preference_type, "ptype1");
            assert.strictEqual(pref.preference_identifier, "pid1");
            assert.strictEqual(pref.preference_type_weight, 10);
            assert.strictEqual(pref.preference_identifier_weight, 20);
        });
    });

    describe("", function() {
        it("fail to add same preference with same type and id again for the same user", function() {
            let error_occured = false;
            try {
                userPreferencesUtils.addPreference(1, "ptype1", "pid1", 31, 69);
            } catch (e) {
                assert.strictEqual(e.code, "SQLITE_CONSTRAINT_TRIGGER");
                error_occured = true;
            }
            assert.ok(error_occured);
        });
    });

    describe("", function() {
        it("can add user with the same id same preference type but different preference id", function() {
            let error_occured = false;
            try {
                userPreferencesUtils.addPreference(1, "ptype1", "pid2", 31, 69);
            } catch (e) {
                assert.strictEqual(e.code, "SQLITE_CONSTRAINT_TRIGGER");
                error_occured = true;
            }
            assert.ok(!error_occured);
        });
    });

    describe("", function() {
        it("can add user with the same id same preference id but different preference type", function() {
            let error_occured = false;
            try {
                userPreferencesUtils.addPreference(1, "ptype2", "pid1", 31, 69);
            } catch (e) {
                assert.strictEqual(e.code, "SQLITE_CONSTRAINT_TRIGGER");
                error_occured = true;
            }
            assert.ok(!error_occured);
        });
    });

    describe("", function() {
        it("add same preference with same type and id again for different user", function() {
            let error_occured = false;
            try {
                userPreferencesUtils.addPreference(2, "ptype1", "pid1", 31, 69);
            } catch (e) {
                assert.strictEqual(e.code, "SQLITE_CONSTRAINT_TRIGGER");
                error_occured = true;
            }
            assert.ok(!error_occured);
        });
    });

    describe("", function () {
       it("test updatePreferenceWeights", function() {
           userPreferencesUtils.updatePreferenceWeights(1, "ptype1", "pid1", 31, 69);
           let pref = userPreferencesUtils.getPreference(1, "ptype1", "pid1");
           assert.strictEqual(pref.user_id, 1);
           assert.strictEqual(pref.preference_type, "ptype1");
           assert.strictEqual(pref.preference_identifier, "pid1");
           assert.strictEqual(pref.preference_type_weight, 31);
           assert.strictEqual(pref.preference_identifier_weight, 69);
       });
    });

    describe("", function() {
       it("test updatePreferenceIdentifierWeight", function() {
           userPreferencesUtils.updatePreferenceIdentifierWeight(1, "ptype1", "pid1", 70);
           let pref = userPreferencesUtils.getPreference(1, "ptype1", "pid1");
           assert.strictEqual(pref.user_id, 1);
           assert.strictEqual(pref.preference_type, "ptype1");
           assert.strictEqual(pref.preference_identifier, "pid1");
           assert.strictEqual(pref.preference_type_weight, 31);
           assert.strictEqual(pref.preference_identifier_weight, 70);
       });
    });

    describe("", function() {
        it("test updatePreferenceTypeWeight", function() {
            userPreferencesUtils.updatePreferenceTypeWeight(1, "ptype1", "pid1", 32);
            let pref = userPreferencesUtils.getPreference(1, "ptype1", "pid1");
            assert.strictEqual(pref.user_id, 1);
            assert.strictEqual(pref.preference_type, "ptype1");
            assert.strictEqual(pref.preference_identifier, "pid1");
            assert.strictEqual(pref.preference_type_weight, 32);
            assert.strictEqual(pref.preference_identifier_weight, 70);
        });
    });

    describe("", function() {
        it("test getCommonPreferenceTypes", function() {
            userPreferencesUtils.addPreference(2, "ptype2", "pid1", 1, 0);
            userPreferencesUtils.addPreference(2, "ptype1", "pid2", 12, 25);
            let res = userPreferencesUtils.getCommonPreferenceTypes([1, 2]);
            let valids = {
                "ptype1": true,
                "ptype2": true,
            }
            assert.strictEqual(res.length, 2);
            for (let i=0; i<res.length; i++) {
                assert.ok(res[i] in valids);
            }
        });
    });
});