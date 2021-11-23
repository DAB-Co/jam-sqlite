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

    setPreference(preference_name, preference_type, user_weights) {
        if (this.hasPreference(preference_name)) {
            this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET user_weights=? WHERE preference_name=?`, [JSON.stringify(user_weights)]);
        }
        else {
            this.databaseWrapper.run_query(`INSERT INTO ${this.table_name}(preference_name, preference_type, user_weights) VALUES(?,?,?)`, [preference_name, preference_type, JSON.stringify(user_weights)]);
        }
    }

    getPreferenceData(preference_name) {
        return this.databaseWrapper.run_query(`SELECT * FROM ${this.table_name} WHERE preference_name=?`, [preference_name]);
    }
}

module.exports = CommonPreferencesUtils;