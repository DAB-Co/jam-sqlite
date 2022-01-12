const path = require("path");
const setup = require(path.join(__dirname, "setup.js"));
const assert = require("assert");

const jam_sqlite = setup.jam_sqlite;
const UserFriendsUtils = jam_sqlite.Utils.UserFriendsUtils;

describe(__filename, function (){
    let database = undefined;
    let accounts = undefined;
    let userFriendsUtils = undefined;

    before(function(){
        database = setup.create_database();
        accounts = setup.register_accounts(database, 3);
        userFriendsUtils = new UserFriendsUtils(database);

        userFriendsUtils.addUser(1);
        userFriendsUtils.addUser(2);

        userFriendsUtils.addFriend(1, 2);
    });

    describe("", function (){
        it("user 1 friends with user 2", function() {
            let user1friends = userFriendsUtils.getFriends(1);
            assert.ok((user1friends !== undefined && 2 in user1friends && user1friends[2]["username"] === accounts[2].username));
        });
    });

    describe("", function() {
        it("user 2 friends with user 1", function() {
            let user2friends = userFriendsUtils.getFriends(2);
            assert.ok(user2friends !== undefined && 1 in user2friends && user2friends[1]["username"] === accounts[1].username);
        });
    });

    describe("", function () {
        it("user 1 blocked by user 2", function() {
            userFriendsUtils.blockUser(1, 2);
            let user1friends = userFriendsUtils.getFriends(1);
            assert.ok(user1friends !== undefined && 2 in user1friends && user1friends[2]["blocked"]);
        });
    });

    describe("", function() {
        it("user 1 is not blocked in user 2", function() {
            let user2friends = userFriendsUtils.getFriends(2);
            assert.ok(user2friends !== undefined && 1 in user2friends && !user2friends[1]["blocked"]);
        });
    })
});
