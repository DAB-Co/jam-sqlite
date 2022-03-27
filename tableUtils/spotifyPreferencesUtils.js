const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"));

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
        if (!Array.isArray(images)) {
            throw new TypeError("images is not an array");
        }
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET (type, name, images)=(?, ?, ?) WHERE preference_id = ?`, [type, name, JSON.stringify(images), preference_id]);
    }

    /**
     *
     * @param preference_id
     * @param type
     */
    update_type(preference_id, type) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET type=? WHERE preference_id = ?`, [type, preference_id]);
    }

    /**
     *
     * @param preference_id
     * @param name
     */
    update_name(preference_id, name) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET name=? WHERE preference_id = ?`, [name, preference_id]);
    }

    /**
     *
     * @param preference_id
     * @param images
     */
    update_images(preference_id, images) {
        if (!Array.isArray(images)) {
            throw new TypeError("images is not an array");
        }
        this.databaseWrapper.run_query(`UPDATE ${this.table_name} SET images=? WHERE preference_id = ?`, [JSON.stringify(images), preference_id]);
    }

    /**
     *
     * @param preference_id
     * @returns {JSON} {preference_id, type, name, images}
     */
    get_preference(preference_id) {
        let res = this.getRowByPrimaryKey(preference_id);
        if (res !== undefined && "images" in res) {
            res.images = JSON.parse(res.images);
        }
        return res;
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
            for (let i=0; i<rows.length; i++) {
                rows[i].images = JSON.parse(rows[i].images);
            }
            return rows;
        }
    }
}

module.exports = SpotifyPreferencesUtils;
