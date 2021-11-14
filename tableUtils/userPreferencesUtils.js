const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class UserPreferencesUtils extends _Row{
    constructor(databaseWrapper) {
        super("user_preferences", databaseWrapper);
    }
}

module.exports = UserPreferencesUtils;