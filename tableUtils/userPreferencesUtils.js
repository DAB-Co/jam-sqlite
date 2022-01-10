const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"));

class UserPreferencesUtils extends _Row {
    /**
     *
     * @param database
     */
    constructor(database) {
        super("user_preferences", database);
    }
}