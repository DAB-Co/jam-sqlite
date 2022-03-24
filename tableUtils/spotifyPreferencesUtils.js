const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class SpotifyPreferencesUtils extends _Row {
    constructor(database) {
        super("spotify_preferences", database, "preference_id");
    }

    /**
     *
     * @param preference_id
     * @param type
     * @param name
     * @param images
     */
    update_preference(preference_id, type, name, images) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET (type, name, images)=(?, ?, ?) WHERE preference_id = ?`, [type, name, images, preference_id]);
    }

    /**
     *
     * @param preference_id
     * @returns {JSON} {preference_id, type, name, images}
     */
    get_preference(preference_id) {
        return this.getRowByPrimaryKey(preference_id);
    }

    /**
     *
     * @param preference_ids
     * @returns {JSON[]} [{preference_id, type, name, images]
     */
    get_preferences(preference_ids) {
        if (!Array.isArray(preference_ids) || preference_ids.length === 0) {
            return [];
        }
        let query_condition = "(";
        for (let i=0; i<preference_ids.length; i++) {
            query_condition += "preference_id=?";
            if (i !== preference_ids.length-1) {
                query_condition += " OR "
            }
        }
        query_condition += ")"
        let rows = this.databaseWrapper.get_all(`SELECT * FROM ${this.table_name} WHERE ${query_condition}`, preference_ids);
        if (rows === undefined) {
            return [];
        }
        else {
            return rows;
        }
    }
}

module.exports = SpotifyPreferencesUtils;
