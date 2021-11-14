const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class MatchesUtils extends _Row{
    constructor(databaseWrapper) {
        super("matches", databaseWrapper);
    }

    get_matches() {

    }
}

module.exports = MatchesUtils;