const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class CommonPreferencesUtils extends _Row{
    constructor(databaseWrapper) {
        super("common_preferences", databaseWrapper, "preference_id");
    }

    hasPreferenceByNameAndType(preference_name, preference_type) {
        let result = this.databaseWrapper.get(`SELECT * FROM ${this.table_name} WHERE preference_name = ? AND preference_type = ?;`, [preference_name, preference_type]);
        return !!result; // return false if undefined
    }

    setPreferenceByName(preference_name, preference_type, user_weights) {
        if (this.hasPreferenceByNameAndType(preference_name, preference_type)) {
            this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET user_weights=? WHERE preference_name=? AND preference_type = ?`, [JSON.stringify(user_weights), preference_name, preference_type]);
        }
        else {
            this.databaseWrapper.run_query(`INSERT INTO ${this.table_name}(preference_name, preference_type, user_weights) VALUES(?,?,?)`, [preference_name, preference_type, JSON.stringify(user_weights)]);
        }
    }

    getUserWeightsByName(preference_name, preference_type) {
        return JSON.parse(this.databaseWrapper.get(`SELECT user_weights FROM ${this.table_name} WHERE preference_name=? AND preference_type=?`, [preference_name, preference_type])["user_weights"]);
    }
}

module.exports = CommonPreferencesUtils;