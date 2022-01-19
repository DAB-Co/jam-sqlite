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
});
