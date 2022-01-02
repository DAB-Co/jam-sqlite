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
    userFriendUtils.addUser(accountUtils.getIdByUsername("user1"));
    accountUtils.addUser("user2@email.com", "user2", "12345678");
    userFriendUtils.addUser(accountUtils.getIdByUsername("user2"));
    userFriendUtils.addFriendByUsername("user1", "user2");

    let user1friends = userFriendUtils.getFriendsByUsername("user1");
    console.assert((user1friends !== undefined && "user2" in user1friends));

    let user2friends = userFriendUtils.getFriendsByUsername("user2");
    console.assert((user2friends !== undefined && "user1" in user2friends));

    userFriendUtils.blockUser("user1", "user2");
    user1friends = userFriendUtils.getFriendsByUsername("user1");
    console.assert((user1friends !== undefined && "user2" in user1friends && user1friends["user2"]["blocked"]));

    user2friends = userFriendUtils.getFriendsByUsername("user2");
    console.assert((user2friends !== undefined && "user1" in user2friends && !user2friends["user1"]["blocked"]));
}

main().then();
