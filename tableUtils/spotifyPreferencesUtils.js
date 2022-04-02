const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"));

//https://www.w3docs.com/snippets/javascript/how-to-check-if-a-value-is-an-object-in-javascript.html
function isObject(objValue) {
    return objValue && typeof objValue === 'object' && objValue.constructor === Object;
}

class SpotifyPreferencesUtils extends _Row {
    constructor(database) {
        super("spotify_preferences", database, "preference_id");
    }

    /**
     *
     * @param preference_id
     * @param type
     * @param name
     * @param data
     */
    update_preference(preference_id, type, name, data) {
        if (!isObject(data)) {
            throw new Error("data is not an object");
        }
        this.databaseWrapper.run_query(`UPDATE ${this.table_name}
                                        SET (type, name, raw_data)= (?, ?, ?)
                                        WHERE preference_id = ?`, [type, name, JSON.stringify(data), preference_id]);
    }

    /**
     *
     * @param preference_id
     * @param type
     */
    update_type(preference_id, type) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name}
                                        SET type=?
                                        WHERE preference_id = ?`, [type, preference_id]);
    }

    /**
     *
     * @param preference_id
     * @param name
     */
    update_name(preference_id, name) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name}
                                        SET name=?
                                        WHERE preference_id = ?`, [name, preference_id]);
    }

    /**
     *
     * @param preference_id
     * @param data
     */
    update_data(preference_id, data) {
        if (!isObject(data)) {
            throw new Error("data is not an object");
        }
        this.databaseWrapper.run_query(`UPDATE ${this.table_name}
                                        SET raw_data=?
                                        WHERE preference_id = ?`, [JSON.stringify(data), preference_id]);
    }

    /**
     *
     * @param preference_id
     * @returns {JSON} {preference_id, type, name, raw_data}
     */
    get_raw_preference(preference_id) {
        return this.getRowByPrimaryKey(preference_id);
    }

    /**
     *
     * @param preference_ids
     * @returns {JSON[]} [{preference_id, type, name, raw_data]
     */
    get_raw_preferences(preference_ids) {
        if (!Array.isArray(preference_ids) || preference_ids.length === 0) {
            return [];
        }
        let query_condition = "(";
        for (let i = 0; i < preference_ids.length; i++) {
            query_condition += "preference_id=?";
            if (i !== preference_ids.length - 1) {
                query_condition += " OR "
            }
        }
        query_condition += ")"
        let rows = this.databaseWrapper.get_all(`SELECT *
                                                 FROM ${this.table_name}
                                                 WHERE ${query_condition}`, preference_ids);
        if (rows === undefined) {
            return [];
        } else {
            return rows;
        }
    }
}

module.exports = SpotifyPreferencesUtils;
