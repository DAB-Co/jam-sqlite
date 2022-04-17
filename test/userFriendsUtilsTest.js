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

        userFriendsUtils.addFriend(1, 2);
    });

    describe("", function () {
        it("getting friends of nonexistent user is undefined", function() {
            let user31friends = userFriendsUtils.getFriends(31);
            assert.strictEqual(user31friends, undefined);
        });
    });

    describe("", function () {
        it("blocking for nonexistent user does nothing", function () {
            userFriendsUtils.unblockUser(31, 69);
            let user31Friends = userFriendsUtils.getFriends(31);
            assert.strictEqual(user31Friends, undefined);
            let user69Friends = userFriendsUtils.getFriends(69);
            assert.strictEqual(user69Friends, undefined);
        });
    })

    describe("", function () {
       it("blocking user 1 from user 3 changes nothing since they are not friends", function() {
           let user3friends = userFriendsUtils.getFriends(3);
           assert.strictEqual(JSON.stringify(user3friends), '{}');
           userFriendsUtils.blockUser(3, 1);
           user3friends = userFriendsUtils.getFriends(3);
           assert.strictEqual(JSON.stringify(user3friends), '{}');
       })
    });

    describe("", function () {
       it("adding 1 as a friend of 31 changes nothing since 31 isn't an user", function() {
           let user31friends = userFriendsUtils.getFriends(31);
           assert.strictEqual(user31friends, undefined);
           userFriendsUtils.addFriend(31, 1);
           user31friends = userFriendsUtils.getFriends(31);
           assert.strictEqual(user31friends, undefined);
       });
    });

    describe("", function () {
       it("adding 31 as a friend of 1 changes nothing since 31 isn't an user", function () {
           let user1friends = userFriendsUtils.getFriends(1);
           assert.strictEqual(JSON.stringify(user1friends), '{"2":{"username":"user2","blocked":false}}');
           userFriendsUtils.addFriend(1, 31);
           user1friends = userFriendsUtils.getFriends(1);
           assert.strictEqual(JSON.stringify(user1friends), '{"2":{"username":"user2","blocked":false}}');
       });
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
        it("user 2 blocked by user 1", function() {
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
    });

    describe("", function () {
        it("user 2 unblocking 1 doesn't unblock 1 from 2", function () {
            userFriendsUtils.unblockUser(2, 1);
            let user2friends = userFriendsUtils.getFriends(2);
            assert.ok(user2friends !== undefined && 1 in user2friends && !user2friends[1]["blocked"]);
        });
    });

    describe("", function () {
        it("nonexistent user unblocking does nothing", function () {
            userFriendsUtils.unblockUser(31, 69);
            let user31Friends = userFriendsUtils.getFriends(31);
            assert.strictEqual(user31Friends, undefined);
            let user69Friends = userFriendsUtils.getFriends(69);
            assert.strictEqual(user69Friends, undefined);
        });
    });

    describe("", function () {
       it("unblocking 3 from 1 changes nothing since they are not friends", function () {
           userFriendsUtils.unblockUser(1, 3);
           let user1Friends = userFriendsUtils.getFriends(1);
           assert.ok(user1Friends !== undefined && !(3 in user1Friends));
       });
    });

    describe("", function () {
        it("user 1 unblocks user 2 successfully", function () {
            userFriendsUtils.unblockUser(1, 2);
            let user1friends = userFriendsUtils.getFriends(1);
            assert.ok(user1friends !== undefined && !user1friends[2]["blocked"]);
        });
    });

    describe("", function () {
        it("delete user friend", function () {
            userFriendsUtils.deleteFriend(1);
            let pref = userFriendsUtils.getFriends(1);
            assert.strictEqual(pref,undefined);
        });
    });
});
