const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class MatchesUtils extends _Row{
    constructor(databaseWrapper) {
        super("matches", databaseWrapper, "user_id");
    }

    get_user_connections(user_id) {
        return JSON.parse(this.getColumnByPrimaryKey(user_id, "user_connections"));
    }

    addUser(user_id) {
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} (user_id, user_connections) VALUES (?, ?);`, [user_id, "{}"]);
    }

    update_user_connections(user_id, connections) {
        return this.updateColumnByPrimaryKey(user_id, "user_connections", JSON.stringify(connections));
    }

    set_matched(id1, id2) {
        let c1 = this.get_user_connections(id1);
        c1[id2]["matched"] = true;
        this.update_user_connections(id1, c1);
        let c2 = this.get_user_connections(id2);
        c2[id1]["matched"] = true;
        this.update_user_connections(id2, c2);
    }
}

module.exports = MatchesUtils;