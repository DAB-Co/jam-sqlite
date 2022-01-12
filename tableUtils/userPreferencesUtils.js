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

    addPreference(user_id, preference_type, preference_name, preference_type_weight, preference_name_weight) {

    }

    updatePreference(user_id, preference_type, preference_name, preference_type_weight, preference_name_weight) {

    }

    getPreferences(user_ids) {

    }
}

module.exports = UserPreferencesUtils;
