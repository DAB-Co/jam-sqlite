const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"));

//https://www.w3docs.com/snippets/javascript/how-to-check-if-a-value-is-an-object-in-javascript.html
function isObject(objValue) {
    return objValue && typeof objValue === 'object' && objValue.constructor === Object;
}

class MatchesSnapshotUtils extends _Row {
    insertSnapshot(snapshot) {

    }

    getSnapshot(snapshot_id) {

    }

    getLastSnapshot() {

    }
}
