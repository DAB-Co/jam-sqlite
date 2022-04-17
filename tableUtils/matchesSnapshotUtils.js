const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"));

//https://www.w3docs.com/snippets/javascript/how-to-check-if-a-value-is-an-object-in-javascript.html
function isObject(objValue) {
    return objValue && typeof objValue === 'object' && objValue.constructor === Object;
}

class MatchesSnapshotUtils extends _Row {
    constructor(database) {
        super("matches_snapshot", database, "snapshot_id");
    }

    insertSnapshot(snapshot) {
        if (!isObject(snapshot)) {
            throw new Error("data is not an object");
        }
        let s = JSON.stringify(snapshot, (key, value) => (value instanceof Map || value instanceof Set ? [...value] : value));
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} (snapshot) VALUES(?)`, [JSON.stringify(s)]);
    }

    /**
     *
     *
     * @param snapshot_id
     * @returns {JSON|undefined}
     */
    getSnapshot(snapshot_id) {
        let res = this.getColumnByPrimaryKey(snapshot_id, "snapshot");

        if (res === undefined) {
            return undefined;
        }
        else {
            return JSON.parse(res, (key, value) => (value instanceof Map || value instanceof Set ? [...value] : value));
        }
    }

    /**
     *
     * @returns {JSON|undefined}
     */
    getLastSnapshot() {
        let res = this.databaseWrapper.get(`SELECT snapshot FROM ${this.table_name} ORDER BY ${this.primary_key} DESC LIMIT 1`);

        if (res === undefined) {
            return undefined;
        }
        else {
            return JSON.parse(res);
        }
    }
}

module.exports = MatchesSnapshotUtils;
