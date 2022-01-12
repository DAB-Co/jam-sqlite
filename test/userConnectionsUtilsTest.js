const path = require("path");
const setup = require(path.join(__dirname, "setup.js"));
const assert = require("assert");

const jam_sqlite = setup.jam_sqlite;
const UserConnectionsUtils = jam_sqlite.Utils.UserConnectionsUtils;

describe(__filename, function (){
    let database = undefined;
    let accounts = undefined;
    let userConnectionsUtils = undefined;

    before(function(){
        database = setup.create_database();
        accounts = setup.register_accounts(database, 3);
        userConnectionsUtils = new UserConnectionsUtils(database);
    });


    describe("", function() {
        it("connection doesn't exist between 1 and 2", function(){
            assert.equal(!userConnectionsUtils.connectionExists(1, 2), true);
        });
    });


    describe("", function(){
        it("add connection between 1 and 2", function() {
            userConnectionsUtils.addConnection(1, 2);
            assert.equal(userConnectionsUtils.connectionExists(1, 2), true);
        })
    });

    describe("", function() {
        it("add connection between 2 and 3", function() {
            userConnectionsUtils.addConnection(2, 3);
            assert.equal(userConnectionsUtils.connectionExists(2, 3), true);
        });
    });

    describe("", function() {
        it("set weight between 1 and 2 to 100 and match", function() {
            userConnectionsUtils.updateConnection(1, 2, 100);
            assert.equal(userConnectionsUtils.getNewMatch(1) === 2 && userConnectionsUtils.getNewMatch(2) === 1, true);
        });
    });

    describe("", function() {
        it("set weight between 2 and 3 to 50 and match 1 and 2 again", function (){
            userConnectionsUtils.updateConnection(2, 3, 50);
            console.assert(userConnectionsUtils.getNewMatch(1) === 2 && userConnectionsUtils.getNewMatch(2) === 1, "matching 1 and 2 failed");
        });
    });

    describe("", function (){
        it("match 3 with 2", function (){
            assert.equal(userConnectionsUtils.getNewMatch(3) === 2, true);
        });
    });

    describe("", function (){
       it("finalize 1 and 2 and match 2 with 3", function (){
           userConnectionsUtils.finalizeMatch(1, 2);
           assert.equal(userConnectionsUtils.getNewMatch(1) === undefined && userConnectionsUtils.getNewMatch(2) === 3
               && userConnectionsUtils.getNewMatch(3) === 2, true);
       });
    });
});
