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
            assert.equal(user1_languages[0] === "ENGLISH" && user1_languages[1] === "TURKISH", true);
        });
    });

    describe("", function() {
        it("add English and Hindu to user 2", function() {
            userLanguagesUtils.addLanguages(2, ["English", "Hindu"]);
            let user2_languages = userLanguagesUtils.getUserLanguages(2);
            assert.equal(user2_languages[0] === "ENGLISH" && user2_languages[1] === "HINDU", true);
        });
    });

    describe("", function() {
        it("add Hindu to user 3", function() {
            userLanguagesUtils.addLanguages(3, ["Hindu"]);
            let user3_languages = userLanguagesUtils.getUserLanguages(3);
            assert.equal(user3_languages[0] === "HINDU", true);
        });
    });

    describe("", function() {
        it("get all Hindu speakers", function() {
            let hindu_speakers = userLanguagesUtils.getUsersWithTheSameLanguages(["Hindu"]);
            assert.equal(hindu_speakers.indexOf(1) === -1 && hindu_speakers.indexOf(2) !== -1 && hindu_speakers.indexOf(3) !== -1, true);
        });
    });

    describe("", function() {
       it("remove Hindu from user 2", function() {
           userLanguagesUtils.removeLanguages(2, ["hindu"]);
           let user2_languages = userLanguagesUtils.getUserLanguages(2);
           assert.equal(user2_languages.indexOf("HINDU") === -1 && user2_languages.indexOf("ENGLISH") !== -1, true);
       });
    });

    describe("", function() {
       it("add Turkish to user 3", function() {
           userLanguagesUtils.addLanguages(3, ["TuRkiSH"]);
           let user3_languages = userLanguagesUtils.getUserLanguages(3);
           assert.equal(user3_languages.indexOf("HINDU") !== -1 && user3_languages.indexOf("TURKISH") !== -1, true);
       });
    });

    describe("", function() {
       it("get users speaking Turkish", function() {
           let turkish_speakers = userLanguagesUtils.getUsersWithTheSameLanguages(["tUrKISH"]);
           assert.equal(turkish_speakers.indexOf(1) !== -1 && turkish_speakers.indexOf(2) === -1 && turkish_speakers.indexOf(3) !== -1, true);
       });
    });

    describe("", function() {
        it("get users speaking English and Hindu", function() {
            let english_and_hindu_speakers = userLanguagesUtils.getUsersWithTheSameLanguages(["english", "hindu"]);
            assert.equal(english_and_hindu_speakers.indexOf(1) !== -1 && english_and_hindu_speakers.indexOf(2) !== -1 && english_and_hindu_speakers.indexOf(3) !== -1,
                true);
        });
    });
});
