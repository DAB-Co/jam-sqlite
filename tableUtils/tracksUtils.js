const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class TracksUtils extends _Row{
    constructor(databaseWrapper) {
        super("tracks", databaseWrapper);
    }
}

module.exports = TracksUtils;