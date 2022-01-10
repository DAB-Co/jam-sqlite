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
}