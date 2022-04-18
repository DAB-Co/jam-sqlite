const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"));

class MatchesSnapshotUtils extends _Row {
    constructor(database) {
        super("matches_snapshot", database, "snapshot_id");
    }

    /**
     *
     * @param {string} snapshot
     */
    insertRawSnapshot(snapshot) {
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} (snapshot) VALUES(?)`, [snapshot]);
    }

    /**
     *
     *
     * @param snapshot_id
     * @returns {string | undefined}
     */
    getRawSnapshot(snapshot_id) {
        return this.getColumnByPrimaryKey(snapshot_id, "snapshot");
    }

    /**
     *
     * @returns {string | undefined}
     */
    getLastSnapshot() {
        return this.databaseWrapper.get(`SELECT snapshot FROM ${this.table_name} ORDER BY ${this.primary_key} DESC LIMIT 1`);
    }
}

module.exports = MatchesSnapshotUtils;
