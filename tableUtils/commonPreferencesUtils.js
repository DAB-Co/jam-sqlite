const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class CommonPreferencesUtils extends _Row{
    constructor(databaseWrapper) {
        super("common_preferences", databaseWrapper);
    }
}

module.exports = CommonPreferencesUtils;