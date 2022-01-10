const path = require("path");
const setup = require(path.join(__dirname, "setup.js"));

const jam_sqlite = setup.jam_sqlite;
const UserFriendsUtils = jam_sqlite.Utils.UserFriendsUtils;


async function main() {
    let database = await setup.setup_database();
    let accounts = setup.register_accounts(database, 2);
    const userFriendUtils = new UserFriendsUtils(database);

    userFriendUtils.addUser(1);
    userFriendUtils.addUser(2);

    userFriendUtils.addFriend(1, 2);

    let user1friends = userFriendUtils.getFriends(1);
    console.assert((user1friends !== undefined && 2 in user1friends && user1friends[2]["username"] === accounts[2].username), "user 1 friends assertion failed");

    let user2friends = userFriendUtils.getFriends(2);
    console.assert((user2friends !== undefined && 1 in user2friends && user2friends[1]["username"] === accounts[1].username), "user 2 friends assertion failed");

    userFriendUtils.blockUser(1, 2);
    user1friends = userFriendUtils.getFriends(1);
    console.assert((user1friends !== undefined && 2 in user1friends && user1friends[2]["blocked"]), "user 1 blocks user 2 failed");

    user2friends = userFriendUtils.getFriends(2);
    console.assert((user2friends !== undefined && 1 in user2friends && !user2friends[1]["blocked"]), "user 2 not blocked in user 1 failed");
}

main().then();
