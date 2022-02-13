const path = require("path");
const setup = require(path.join(__dirname, "setup.js"));
const assert = require("assert");

const jam_sqlite = setup.jam_sqlite;
const UtilsInitializer = jam_sqlite.Utils.UtilsInitializer;

describe(__filename, function() {
    let database = undefined;
    let utilsInitializer = undefined;
    before(function() {
        database = setup.create_database();
        utilsInitializer = new UtilsInitializer(database);
    });

    it("non existent function is undefined", function () {
        assert.strictEqual(utilsInitializer.accountUtils().unknown, undefined);
    });

    describe("accountUtils test", function() {
        it("addUser", function() {
            assert.ok(utilsInitializer.accountUtils().addUser !== undefined);
        });
    })
});
