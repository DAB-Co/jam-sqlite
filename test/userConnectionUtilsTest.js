const path = require("path");
const setup = require(path.join(__dirname, "setup.js"));

const jam_sqlite = setup.jam_sqlite;
const UserConnectionsUtils = jam_sqlite.Utils.UserConnectionsUtils;

async function main() {
    let database = await setup.setup_database();
    let accounts = setup.register_accounts(database, 3);
    let userConnectionsUtils = new UserConnectionsUtils(database);

    console.assert(!userConnectionsUtils.connectionExists(1, 2), "connection exists check failed");

    userConnectionsUtils.addConnection(1, 2);
    console.assert(userConnectionsUtils.connectionExists(1, 2), "connecting 1 to 2 failed");

    userConnectionsUtils.addConnection(2, 3);
    console.assert(userConnectionsUtils.connectionExists(2, 3), "connecting 2 to 3 failed");

    userConnectionsUtils.updateConnection(1, 2, 100);
    console.assert(userConnectionsUtils.getNewMatch(1) === 2 && userConnectionsUtils.getNewMatch(2) === 1, "matching 1 and 2 failed");

    userConnectionsUtils.updateConnection(2, 3, 50);
    console.assert(userConnectionsUtils.getNewMatch(1) === 2 && userConnectionsUtils.getNewMatch(2) === 1, "matching 1 and 2 failed");

    console.assert(userConnectionsUtils.getNewMatch(3) === 2, "matching 2 and 3 failed");

    userConnectionsUtils.finalizeMatch(1, 2);
    console.assert(userConnectionsUtils.getNewMatch(1) === undefined && userConnectionsUtils.getNewMatch(2) === 3
        && userConnectionsUtils.getNewMatch(3) === 2, "finalizing 1 and 2, then matching 2 and 3 failed");
}

main().then();
