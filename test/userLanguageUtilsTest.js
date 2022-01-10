const path = require("path");
const setup = require(path.join(__dirname, "setup.js"));

const jam_sqlite = setup.jam_sqlite;
const UserLanguagesUtils = jam_sqlite.Utils.UserLanguagesUtils;

async function main() {
    let database = await setup.setup_database();
    let accounts = setup.register_accounts(database, 3);

    const userLanguagesUtils = new UserLanguagesUtils(database);

    userLanguagesUtils.addUser(1, ["English", "Turkish"]);
    let user1_languages = userLanguagesUtils.getUserLanguages(1);
    console.assert(user1_languages[0] === "English" && user1_languages[1] === "Turkish", "getting user 1 languages failed");

    userLanguagesUtils.addUser(2, ["English", "Hindu"]);
    let user2_languages = userLanguagesUtils.getUserLanguages(2);
    console.assert(user2_languages[0] === "English" && user2_languages[1] === "Hindu", "getting user 2 languages failed");

    userLanguagesUtils.addUser(3, ["Hindu"]);
    let user3_languages = userLanguagesUtils.getUserLanguages(3);
    console.assert(user3_languages[0] === "Hindu", "getting user 3 languages failed");

    let hindu_speakers = userLanguagesUtils.getUsersWithTheSameLanguages(["Hindu"]);
    console.assert(hindu_speakers.indexOf(1) === -1 && hindu_speakers.indexOf(2) !== -1 && hindu_speakers.indexOf(3) !== -1, "getting hindu speakers failed");
}

main().then();
