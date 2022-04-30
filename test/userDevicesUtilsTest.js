const path = require("path");
const setup = require(path.join(__dirname, "setup.js"));
const assert = require("assert");

const jam_sqlite = setup.jam_sqlite;
const UserDevicesUtils = jam_sqlite.Utils.UserDevicesUtils;

describe(__filename, function() {
    let database = undefined;
    let accounts = undefined;
    let userDevicesUtils = undefined;

    before(function() {
        database = setup.create_database();
        accounts = setup.register_accounts(database, 3);
        userDevicesUtils = new UserDevicesUtils(database);
    });

    describe("", function () {
        it("device id is null at first for user 1", function() {
            assert.strictEqual(userDevicesUtils.getDeviceId(1), null);
        });
    });

    describe("", function() {
       it("update device id 31 for user 1", function() {
           userDevicesUtils.updateDeviceId(1, "31");
           assert.strictEqual(userDevicesUtils.getDeviceId(1), "31");
       });
    });

    describe("", function() {
       it("update device id to 69 for user 2", function() {
           userDevicesUtils.updateDeviceId(2, "69");
           assert.strictEqual(userDevicesUtils.getDeviceId(1), "31");
           assert.strictEqual(userDevicesUtils.getDeviceId(2), "69");
       });
    });

    describe("", function() {
        it("change device id to 59 for user 2", function() {
            userDevicesUtils.updateDeviceId(2, "59");
            assert.strictEqual(userDevicesUtils.getDeviceId(2), "59");
        })
    })

    describe("", function() {
       it("get all device ids", function() {
         let all = userDevicesUtils.getAllDeviceIds();
         for (let i=0; i<all.length; i++) {
             let user = all[i];
             if (user.user_id === 1) {
                 assert.strictEqual(user.device_id, "31");
             }
             else if (user.user_id === 2) {
                 assert.strictEqual(user.device_id, "59");
             }
             else if (user.user_id === 3) {
                 assert.strictEqual(user.device_id, null);
             }
             else {
                assert.fail(user);
             }
         }
       });
    });
});
