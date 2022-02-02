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
    (user_id, preference_type, preference_identifier, preference_type_weight, preference_identifier_weight) VALUES(?,?,?,?,?)`,
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
    getPreference(user_id, preference_type, preference_identifier) {
        return this.databaseWrapper.get(`SELECT * FROM ${this.table_name} WHERE user_id=? AND preference_type=? AND preference_identifier=?`,
            [user_id, preference_type, preference_identifier]);
    }

    /**
     * remove preference from database
     *
     * @param user_id
     * @param preference_type
     * @param preference_identifier
     */
    removePreference(user_id, preference_type, preference_identifier) {
        this.databaseWrapper.run_query(`DELETE FROM ${this.table_name} WHERE user_id=? AND preference_type=? AND preference_identifier=?`, [user_id, preference_type, preference_identifier]);
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
    updatePreferenceWeights(user_id, preference_type, preference_identifier, preference_type_weight, preference_identifier_weight) {
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

    /**
     *
     * @param {number[]} user_ids
     * @returns {string[]} common preference types
     */
    getCommonPreferenceTypes(user_ids) {
        let query_condition = "(";
        for (let i=0; i<user_ids.length; i++) {
            query_condition += "user_id=?";
            if (i !== user_ids.length-1) {
                query_condition += " OR "
            }
        }
        query_condition += ") GROUP BY preference_type HAVING COUNT(*)>1";
        let res = this.databaseWrapper.get_all(`SELECT preference_type FROM ${this.table_name} WHERE ${query_condition}`, user_ids);
        if (res === undefined || res.length === 0) {
            return [];
        }
        else {
            let ret_val = [];
            for (let i=0; i<res.length; i++) {
                ret_val.push(res[i].preference_type);
            }
            return ret_val;
        }
    }

    /**
     * this will include same pref_ids of users even though pref_types are different.
     *
     * @param user_ids
     * @returns {string[]} preference identifiers
     */
    getCommonPreferenceIds(user_ids) {
        let query_condition = "(";
        for (let i=0; i<user_ids.length; i++) {
            query_condition += "user_id=?";
            if (i !== user_ids.length-1) {
                query_condition += " OR "
            }
        }
        query_condition += ") GROUP BY preference_identifier HAVING COUNT(*)>1";
        let res = this.databaseWrapper.get_all(`SELECT preference_identifier FROM ${this.table_name} WHERE ${query_condition}`, user_ids);
        if (res === undefined || res.length === 0) {
            return [];
        }
        else {
            let ret_val = [];
            for (let i=0; i<res.length; i++) {
                ret_val.push(res[i].preference_identifier);
            }
            return ret_val;
        }
    }
}

module.exports = UserPreferencesUtils;
