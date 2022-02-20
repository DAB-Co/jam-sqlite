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
     * @param preference_weight
     */
    addPreference(user_id, preference_type, preference_identifier, preference_weight) {
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} 
    (user_id, preference_type, preference_identifier, preference_weight) VALUES(?,?,?,?)`,
            [user_id, preference_type, preference_identifier, preference_weight]);
    }

    /**
     * get specific preference data for a user
     *
     * @param user_id
     * @param preference_type
     * @param preference_identifier
     * @returns {json | undefined} {
        "user_id",
        "preference_type",
        "preference_identifier",
        "preference_weight",}
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
     * @param preference_weight
     */
    updatePreferenceWeight(user_id, preference_type, preference_identifier, preference_weight) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET 
                 preference_weight=? WHERE user_id=? AND preference_type=? AND preference_identifier=?`,
            [preference_weight, user_id, preference_type, preference_identifier]);
    }

    /**
     *
     * @param user_ids
     * @param preference_type
     * @returns {string[]} preference identifiers
     */
    getCommonPreferenceIds(user_ids, preference_type) {
        if (user_ids === undefined || user_ids.length === 0) {
            return [];
        }
        let query_condition = "(";
        for (let i=0; i<user_ids.length; i++) {
            query_condition += "user_id=?";
            if (i !== user_ids.length-1) {
                query_condition += " OR "
            }
        }
        query_condition += ") AND preference_type=? GROUP BY preference_identifier HAVING COUNT(*)>1";
        let res = this.databaseWrapper.get_all(`SELECT preference_identifier FROM ${this.table_name} WHERE ${query_condition}`, [...user_ids, preference_type]);
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
