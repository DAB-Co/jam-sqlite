const path = require("path");
const setup = require(path.join(__dirname, "setup.js"));
const assert = require("assert");

const jam_sqlite = setup.jam_sqlite;
const UserConnectionsUtils = jam_sqlite.Utils.UserConnectionsUtils;
const UserLanguagesUtils = jam_sqlite.Utils.UserLanguagesUtils;

describe(__filename, function () {
    let database = undefined;
    let accounts = undefined;
    let userConnectionsUtils = undefined;
    let userLanguagesUtils = undefined;

    before(function () {
        database = setup.create_database();
        accounts = setup.register_accounts(database, 4);
        userConnectionsUtils = new UserConnectionsUtils(database);
        userLanguagesUtils = new UserLanguagesUtils(database);
        userLanguagesUtils.addLanguages(1, ["Turkish"]);
        userLanguagesUtils.addLanguages(2, ["Turkish"]);
        userLanguagesUtils.addLanguages(3, ["Turkish"]);
    });


    describe("", function () {
        it("connection doesn't exist between 1 and 2", function () {
            assert.strictEqual(userConnectionsUtils.getWeight(1, 2), undefined);
        });
    });


    describe("", function () {
        it("add connection between 1 and 2", function () {
            userConnectionsUtils.addConnection(1, 2);
            assert.strictEqual(userConnectionsUtils.getWeight(1, 2), 0);
        })
    });

    describe("", function () {
        it("try to add the same connection again", function () {
            let bothPassed = true;
            try {
                userConnectionsUtils.addConnection(2, 1);
            } catch (e) {
                bothPassed = false;
            }
            try {
                userConnectionsUtils.addConnection(1, 2);
            } catch (e) {
                bothPassed = false;
            }
            assert.ok(!bothPassed, "no error occurred adding duplicate connection");
        });
    });

    describe("", function () {
        it("try to connect to user to itself", function () {
            let errOccurred = false;
            try {
                userConnectionsUtils.addConnection(1, 1);
            } catch (e) {
                errOccurred = true;
            }
            assert.ok(errOccurred, "no error occurred conecting user to itself");
        });
    });

    describe("", function () {
        it("add connection between 3 and 2", function () {
            userConnectionsUtils.addConnection(3, 2);
            assert.strictEqual(userConnectionsUtils.getWeight(2, 3), 0);
        });
    });

    describe("", function () {
        it("set weight between 1 and 2 to 100 and match", function () {
            userConnectionsUtils.updateConnection(1, 2, 100);
            assert.ok(userConnectionsUtils.getNewMatch(1) === 2 && userConnectionsUtils.getNewMatch(2) === 1);
        });
    });

    describe("", function () {
        it("assert weight between 1 and 2 equal to 100", function () {
            assert.strictEqual(userConnectionsUtils.getWeight(2, 1), 100);
        });
    });

    describe("", function () {
        it("set weight between 2 and 3 to 50 and match 1 and 2 again", function () {
            userConnectionsUtils.updateConnection(2, 3, 50);
            assert.ok(userConnectionsUtils.getNewMatch(1) === 2 && userConnectionsUtils.getNewMatch(2) === 1);
        });
    });

    describe("", function () {
        it("match 3 with 2", function () {
            assert.ok(userConnectionsUtils.getNewMatch(3) === 2);
        });
    });

    describe("", function () {
        it("1 and 2 don't have same language so can't be matched", function () {
            userLanguagesUtils.removeLanguages(1, ["turkish"]);
            assert.strictEqual(userConnectionsUtils.getNewMatch(1), undefined);
            assert.strictEqual(userConnectionsUtils.getNewMatch(2), 3);
        });
    });

    describe("", function () {
        it("finalize 1 and 2 and match 2 with 3", function () {
            userConnectionsUtils.finalizeMatch(1, 2);
            assert.ok(userConnectionsUtils.getNewMatch(1) === undefined && userConnectionsUtils.getNewMatch(2) === 3
                && userConnectionsUtils.getNewMatch(3) === 2);
        });
    });

    describe("", function () {
        it("add weight between 1 and 4 via addConnection", function () {
            userConnectionsUtils.addConnection(1, 4, 41);
            assert.strictEqual(userConnectionsUtils.getWeight(1, 4), 41);
        });
    });

    describe("", function () {
        it("get matched test", function () {
            let pref = userConnectionsUtils.getMatched(1,4);
            assert.strictEqual(pref,0);
        });
    });

    describe("", function() {
        it("delete matched test", function () {
            userConnectionsUtils.deleteMatched(1);
            let pref = userConnectionsUtils.getWeight(1,2);
            assert.strictEqual(pref,undefined);
        });
    });

    describe("", function() {
        it("dumpGraph test", function() {
           userConnectionsUtils.databaseWrapper.run_query(`DELETE FROM ${userConnectionsUtils.table_name}`);
           let graph = new Map();
           graph.set(1, new Map());
           graph.set(2, new Map());
           graph.set(3, new Map());

           graph.get(1).set(2, 3);
           graph.get(2).set(1, 3);

           graph.get(3).set(1, 31);
           graph.get(1).set(3, 31);

           let matched = new Map();
           matched.set(1, new Set());
           matched.set(2, new Set());

           matched.get(1).add(2);
           matched.get(2).add(1);

           userConnectionsUtils.dump(graph, matched);

           let {matched:matched_res, graph:graph_res} = userConnectionsUtils.load();

           assert.strictEqual(graph.size, graph_res.size);
           for (const [u1, edges] of graph_res) {
               for (const [u2, weight] of edges) {
                   assert.strictEqual(graph.get(u1).get(u2), weight);
               }
           }

           assert.strictEqual(matched_res.size, matched.size);
           for (const [u1, matches] of matched_res) {
               for (const u2 of matches) {
                   assert.ok(matched.get(u1).has(u2));
               }
           }
        });
    })
});
