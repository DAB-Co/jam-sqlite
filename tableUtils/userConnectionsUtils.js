const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"));

class UserConnectionsUtils extends _Row {
    /**
     *
     * @param database
     */
    constructor(database) {
        super("user_connections", database);
    }

    addConnection(user1_id, user2_id, weight) {

    }

    updateConnection(user1_id, user2_id, weight) {

    }

    getNewMatch(user_id) {

    }

    finalizeMatch(user1_id, user2_id) {

    }
}

module.exports = UserConnectionsUtils;
