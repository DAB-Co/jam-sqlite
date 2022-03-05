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
}

module.exports = SpotifyPreferencesUtils;
