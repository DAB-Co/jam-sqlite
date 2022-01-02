const path = require("path");
const fs = require("fs");

const jam_sqlite = require(path.join(__dirname, "..", "main.js"));
const database_scripts = jam_sqlite.database_scripts;
const Database = jam_sqlite.Database;
const UserFriendsUtils = jam_sqlite.Utils.UserFriendsUtils;
const AccountUtils = jam_sqlite.Utils.AccountUtils;


async function main() {
    const db_dir = path.join(__dirname, "..", "sqlite");
    const db_path = path.join(db_dir, "database.db");
    try {
        fs.unlinkSync(db_path);
    } catch (e) {

    }

    await database_scripts.create_database(db_dir, "database.db");
    const database = new Database(db_path);
    const userFriendUtils = new UserFriendsUtils(database);
    const accountUtils = new AccountUtils(database);
    accountUtils.addUser("user1@email.com", "user1", "12345678");
    accountUtils.addUser("user2@email.com", "user2", "12345678");

    const user1Id = accountUtils.getIdByUsername("user1");
    const user2Id = accountUtils.getIdByUsername("user2");


    userFriendUtils.addUser(user1Id);
    userFriendUtils.addUser(user2Id);

    userFriendUtils.addFriend(user1Id, user2Id);

    let user1friends = userFriendUtils.getFriends(user1Id);
    console.assert((user1friends !== undefined && user2Id in user1friends && user1friends[user2Id]["username"] === "user2"), "user1friends assertion failed");

    let user2friends = userFriendUtils.getFriends(user2Id);
    console.assert((user2friends !== undefined && user1Id in user2friends && user2friends[user1Id]["username"] === "user1"), "user2friends assertion failed");

    userFriendUtils.blockUser(user1Id, user2Id);
    user1friends = userFriendUtils.getFriends(user1Id);
    console.assert((user1friends !== undefined && user2Id in user1friends && user1friends[user2Id]["blocked"]), "user1 blocks user2 failed");

    user2friends = userFriendUtils.getFriends(user2Id);
    console.assert((user2friends !== undefined && user1Id in user2friends && !user2friends[user1Id]["blocked"]), "user2 not blocked in user1 failed");
}

main().then();
