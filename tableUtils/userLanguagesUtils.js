const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"));

class UserLanguagesUtils extends _Row {
    /**
     *
     * @param database
     */
    constructor(database) {
        super("user_languages", database);
    }

    /**
     *
     * @param user_id
     * @param {string[]} languages
     */
    addLanguages(user_id, languages) {
        for (let i=0; i<languages.length; i++) {
            this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} (user_id, language) VALUES (?,?)`, [user_id, languages[i].toUpperCase()]);
        }
    }

    /**
     * remove array of languages from user
     *
     * if the language doesn't exist, nothing wil change
     *
     * @param user_id
     * @param {string[]} languages
     */
    removeLanguages(user_id, languages) {
        for (let i=0; i<languages.length; i++) {
            languages[i] = languages[i].toUpperCase();
        }
        let query_condition = "";
        for (let i=0; i<languages.length; i++) {
            query_condition += " language=?";
            if (i !== languages.length-1) {
                query_condition += " OR "
            }
        }
        this.databaseWrapper.run_query(`DELETE FROM ${this.table_name} WHERE user_id=? AND ${query_condition}`, [user_id].concat(languages));
    }

    /**
     *
     * @param user_id
     * @returns {string[]} languages spoken by a user's id
     */
    getUserLanguages(user_id) {
        let rows = this.databaseWrapper.get_all(`SELECT language FROM ${this.table_name} WHERE user_id = ?`, [user_id]);
        if (rows === undefined) {
            return [];
        }
        else {
            let languages = [];
            for (let i=0; i<rows.length; i++) {
                languages.push(rows[i].language);
            }
            return languages;
        }
    }

    /**
     *
     * @param {string[]} languages
     * @returns {number[]} user_ids
     */
    getUsersWithTheSameLanguages(languages) {
        for (let i=0; i<languages.length; i++) {
            languages[i] = languages[i].toUpperCase();
        }
        let query_condition = "";
        for (let i=0; i<languages.length; i++) {
            query_condition += " language=?";
            if (i !== languages.length-1) {
                query_condition += " OR "
            }
        }
        let rows = this.databaseWrapper.get_all(`SELECT user_id FROM ${this.table_name} WHERE ${query_condition}`, languages);
        if (rows === undefined) {
            return [];
        }
        else {
            let speakers = [];
            for (let i=0; i<rows.length; i++) {
                speakers.push(rows[i].user_id);
            }
            return speakers;
        }
    }
}

module.exports = UserLanguagesUtils;
