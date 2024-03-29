const path = require("path");
const setup = require(path.join(__dirname, "setup.js"));
const assert = require("assert");

const jam_sqlite = setup.jam_sqlite;
const UserLanguagesUtils = jam_sqlite.Utils.UserLanguagesUtils;

describe(__filename, function() {
    let database = undefined;
    let accounts = undefined;
    let userLanguagesUtils = undefined;

    before(function (){
        database = setup.create_database();
        accounts = setup.register_accounts(database, 3);
        userLanguagesUtils = new UserLanguagesUtils(database);
    });

    describe("", function() {
        it("add Turkish and English to user 1", function() {
            userLanguagesUtils.addLanguages(1, ["English", "Turkish"]);
            let user1_languages = userLanguagesUtils.getUserLanguages(1);
            assert.ok(user1_languages[0] === "ENGLISH" && user1_languages[1] === "TURKISH");
        });
    });

    describe("", function () {
        it("try to add Turkish to user 1 again", function() {
            let errorOccurred = false;
            try {
                userLanguagesUtils.addLanguages(1, ["turkish"]);
            } catch (e) {
                assert.strictEqual(e.message, "UNIQUE constraint failed: user_languages.user_id, user_languages.language");
                errorOccurred = true;
            }
            assert.ok(errorOccurred, "no error occurred adding Turkish to user 1 again");
        });
    });

    describe("", function() {
        it("add English and Hindu to user 2", function() {
            userLanguagesUtils.addLanguages(2, ["English", "Hindu"]);
            let user2_languages = userLanguagesUtils.getUserLanguages(2);
            assert.ok(user2_languages[0] === "ENGLISH" && user2_languages[1] === "HINDU");
        });
    });

    describe("", function() {
        it("add Hindu to user 3", function() {
            userLanguagesUtils.addLanguages(3, ["Hindu"]);
            let user3_languages = userLanguagesUtils.getUserLanguages(3);
            assert.ok(user3_languages[0] === "HINDU");
        });
    });

    describe("", function() {
        it("get all Hindu speakers", function() {
            let hindu_speakers = userLanguagesUtils.getUsersWithTheSameLanguages(["Hindu"]);
            assert.ok(hindu_speakers.indexOf(1) === -1 && hindu_speakers.indexOf(2) !== -1 && hindu_speakers.indexOf(3) !== -1);
        });
    });

    describe("", function () {
        it("user 1 can speak to 2", function () {
            let can_speak = userLanguagesUtils.getUserCanSpeakWith(1);
            assert.ok(can_speak.indexOf(1) === -1 && can_speak.indexOf(2) !== -1 && can_speak.indexOf(3) === -1);
        });
    })

    describe("", function() {
        it("remove Hindu from user 2", function() {
            userLanguagesUtils.removeLanguages(2, ["hindu"]);
            let user2_languages = userLanguagesUtils.getUserLanguages(2);
            assert.ok(user2_languages.indexOf("HINDU") === -1 && user2_languages.indexOf("ENGLISH") !== -1);
        });
    });

    describe("", function() {
        it("add Turkish to user 3", function() {
            userLanguagesUtils.addLanguages(3, ["TuRkiSH"]);
            let user3_languages = userLanguagesUtils.getUserLanguages(3);
            assert.ok(user3_languages.indexOf("HINDU") !== -1 && user3_languages.indexOf("TURKISH") !== -1);
        });
    });

    describe("", function() {
        it("get users speaking Turkish", function() {
            let turkish_speakers = userLanguagesUtils.getUsersWithTheSameLanguages(["tUrKISH"]);
            assert.ok(turkish_speakers.indexOf(1) !== -1 && turkish_speakers.indexOf(2) === -1 && turkish_speakers.indexOf(3) !== -1);
        });
    });

    describe("", function() {
        it("get users speaking English and Hindu", function() {
            let english_and_hindu_speakers = userLanguagesUtils.getUsersWithTheSameLanguages(["english", "hindu"]);
            assert.ok(english_and_hindu_speakers.indexOf(1) !== -1 && english_and_hindu_speakers.indexOf(2) !== -1 && english_and_hindu_speakers.indexOf(3) !== -1);
        });
    });

    describe("", function () {
        it("user 1 can speak to 2 and 3", function () {
            let can_speak = userLanguagesUtils.getUserCanSpeakWith(1);
            assert.ok(can_speak.indexOf(1) === -1 && can_speak.indexOf(2) !== -1 && can_speak.indexOf(3) !== -1);
        });
    });

    describe("", function () {
        it("delete user language", function () {
            userLanguagesUtils.deleteUserLanguage(1);
            let pref = userLanguagesUtils.getUserLanguages(1);
            assert.strictEqual(pref.length,0);
        });
    });

    describe("", function() {
        it("getAllCommonLanguages", function() {
            userLanguagesUtils.addLanguages(1, ["ENGLISH", "Russian"]);
            let res = userLanguagesUtils.getAllCommonLanguages();

            assert.ok(res.has("ENGLISH"));
            assert.ok(res.get("ENGLISH").has(1));
            assert.ok(res.get("ENGLISH").has(2));

            assert.ok(res.has("HINDU"));
            assert.ok(res.get("HINDU").has(3));

            assert.ok(res.has("RUSSIAN"));
            assert.ok(res.get("RUSSIAN").has(1));

            assert.ok(res.has("TURKISH"));
            assert.ok(res.get("TURKISH").has(3));
        });
    });
});
