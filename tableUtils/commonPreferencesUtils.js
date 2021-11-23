const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class CommonPreferencesUtils extends _Row{
    constructor(databaseWrapper) {
        super("common_preferences", databaseWrapper, "preference_id");
    }

    hasPreference(preference_name) {
        let result = this.databaseWrapper.get(`SELECT * FROM ${this.table_name} WHERE preference_name = ?;`, [preference_name]);
        return !!result; // return false if undefined
    }

    updatePreference(preference_name, preference_type, user_weights) {
        if (this.hasPreference(preference_name)) {
            this.databaseWrapper.run_query();
        }
        else {
            this.databaseWrapper.run_query();
        }
    }
}

module.exports = CommonPreferencesUtils;