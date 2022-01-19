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

    /**
     * add new preference to the database
     *
     * @param user_id
     * @param preference_type
     * @param preference_identifier
     * @param preference_type_weight
     * @param preference_identifier_weight
     */
    addPreference(user_id, preference_type, preference_identifier, preference_type_weight, preference_identifier_weight) {
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} 
    (user_id, preference_type, preference_identifier, preference_type_weight, preference_name_weight) VALUES(?,?,?,?,?,)`,
            [user_id, preference_type, preference_identifier, preference_type_weight, preference_identifier_weight]);
    }

    /**
     * get specific preference data for a user
     *
     * @param user_id
     * @param preference_type
     * @param preference_identifier
     * @returns {json} {
        "user_id",
        "preference_type",
        "preference_identifier",
        "preference_type_weight,
        "preference_identifier_weight",}
     */
    getUserPreference(user_id, preference_type, preference_identifier) {
        return this.databaseWrapper.get(`SELECT * FROM ${this.table_name} WHERE user_id=? AND preference_type=? AND preference_identifier=?`,
            [user_id, preference_type, preference_identifier]);
    }

    /**
     * update preference type weight and preference identifier weight
     *
     * @param user_id
     * @param preference_type
     * @param preference_identifier
     * @param preference_type_weight
     * @param preference_identifier_weight
     */
    updateUserPreferenceWeights(user_id, preference_type, preference_identifier, preference_type_weight, preference_identifier_weight) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET 
                 preference_type_weight=?, preference_identifier_weight=? WHERE user_id=? AND preference_type=? AND preference_identifier=?`,
            [preference_type_weight, preference_identifier_weight, user_id, preference_type, preference_identifier]);
    }

    /**
     * update preference identifier weight of a given user
     *
     * @param user_id
     * @param preference_type
     * @param preference_identifier
     * @param preference_identifier_weight
     */
    updatePreferenceIdentifierWeight(user_id, preference_type, preference_identifier, preference_identifier_weight) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET preference_identifier_weight=? WHERE user_id=? AND preference_type=? AND preference_identifier=?`,
            [preference_identifier_weight, user_id, preference_type, preference_identifier]);
    }

    /**
     * update preference type weight of a given user
     *
     * @param user_id
     * @param preference_type
     * @param preference_identifier
     * @param preference_type_weight
     */
    updatePreferenceTypeWeight(user_id, preference_type, preference_identifier, preference_type_weight) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET preference_type_weight=? WHERE user_id=? AND preference_type=? AND preference_identifier=?`,
            [preference_type_weight, user_id, preference_type, preference_identifier]);
    }

    getCommonPreferences(user_ids) {
        let query_condition = "(";
        for (let i=0; i<user_ids.length; i++) {
            query_condition += " user_id=?";
            if (i !== user_ids.length-1) {
                query_condition += " OR "
            }
        }
        query_condition += ") GROUP BY preference_type HAVING COUNT(*)>1";
        let same_preference_type = this.databaseWrapper.get_all(`SELECT user_id, preference_type, preference_name FROM ${this.table_name} WHERE ${query_condition}`);
        console.log(same_preference_type);
        return same_preference_type;
    }
}

module.exports = UserPreferencesUtils;
