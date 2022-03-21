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
     * @param preference_identifier
     * @returns {json | undefined} {
        "user_id",
        "preference_type",
        "preference_identifier",
        "preference_weight",}
     */
    getPreference(user_id, preference_identifier) {
        return this.databaseWrapper.get(`SELECT * FROM ${this.table_name} WHERE user_id=? AND preference_identifier=?`,
            [user_id, preference_identifier]);
    }

    /**
     * remove preference from database
     *
     * @param user_id
     * @param preference_identifier
     */
    removePreference(user_id, preference_identifier) {
        this.databaseWrapper.run_query(`DELETE FROM ${this.table_name} WHERE user_id=? AND preference_identifier=?`, [user_id, preference_identifier]);
    }

    /**
     * update preference type weight and preference identifier weight
     *
     * @param user_id
     * @param preference_identifier
     * @param preference_weight
     */
    updatePreferenceWeight(user_id, preference_identifier, preference_weight) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET 
                 preference_weight=? WHERE user_id=? AND preference_identifier=?`,
            [preference_weight, user_id, preference_identifier]);
    }

    /**
     * get common user ids for a given preference
     *
     * @param preference_identifier
     * @returns {number[]} user ids
     */
    getCommonUserIds(preference_identifier) {
        // `GROUP BY user_id` is not needed because triggers do not allow duplicates while insertion
        let res = this.databaseWrapper.get_all(`SELECT user_id FROM ${this.table_name} WHERE preference_identifier=?`, [preference_identifier]);
        if (res === undefined || res.length === 0) {
            return [];
        }
        else {
            let ret_val = [];
            for (let i=0; i<res.length; i++) {
                ret_val.push(res[i].user_id);
            }
            return ret_val;
        }
    }

    /**
     *
     * @param user_id
     * @returns {string[]} preference identifiers
     */
    getUserPreferences(user_id) {
        if (user_id === undefined) {
            return [];
        }

        let res = this.databaseWrapper.get_all(`SELECT preference_identifier FROM ${this.table_name} WHERE user_id=?`, user_id);

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
