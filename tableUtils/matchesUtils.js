const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class MatchesUtils extends _Row{
    constructor(databaseWrapper) {
        super("matches", databaseWrapper, "user_id");
    }

    get_user_connections(user_id) {
        return JSON.parse(this.get_column(user_id, "user_connections"));
    }

    addUser(user_id) {
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} (user_id, user_connections) VALUES (?, ?);`, [user_id, "{}"]);
    }

    update_user_connections(user_id, connections) {
        return this.update_column(user_id, "user_connections", JSON.stringify(connections));
    }
}

module.exports = MatchesUtils;