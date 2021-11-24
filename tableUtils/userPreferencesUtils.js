const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class UserPreferencesUtils extends _Row{
    constructor(databaseWrapper) {
        super("user_preferences", databaseWrapper, "user_id");
    }

    addUser(id) {
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name}(${this.primary_key}, "user_preferences") VALUES(?,?)`, [id, "{}"]);
    }

    getPreferences(id) {
        return JSON.parse(this.get_column(id, "user_preferences"));
    }

    updatePreferences(id, preferences) {
        this.update_column(id, "user_preferences", JSON.stringify(preferences));
    }
}

module.exports = UserPreferencesUtils;
