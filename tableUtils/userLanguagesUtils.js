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
        for (let i = 0; i < languages.length; i++) {
            try {
                this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} (user_id, language)
                                                VALUES (?, ?)`, [user_id, languages[i].toUpperCase()]);
            } catch (e) {
                if (e.message === "this language for this user exists") {
                    // do nothing if the language already exists
                } else {
                    throw e;
                }
            }
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
        if (languages === undefined || languages == null || !Array.isArray(languages) || languages.length === 0) {
            return;
        }
        for (let i = 0; i < languages.length; i++) {
            languages[i] = languages[i].toUpperCase();
        }
        let query_condition = "";
        for (let i = 0; i < languages.length; i++) {
            query_condition += " language=?";
            if (i !== languages.length - 1) {
                query_condition += " OR "
            }
        }
        this.databaseWrapper.run_query(`DELETE
                                        FROM ${this.table_name}
                                        WHERE user_id = ?
                                          AND ${query_condition}`, [user_id].concat(languages));
    }

    /**
     *
     * @param user_id
     * @returns {string[]} languages spoken by a user's id
     */
    getUserLanguages(user_id) {
        let rows = this.databaseWrapper.get_all(`SELECT language
                                                 FROM ${this.table_name}
                                                 WHERE user_id = ?`, [user_id]);
        if (rows === undefined) {
            return [];
        } else {
            let languages = [];
            for (let i = 0; i < rows.length; i++) {
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
        if (languages === undefined || languages == null || !Array.isArray(languages) || languages.length === 0) {
            return [];
        }
        for (let i = 0; i < languages.length; i++) {
            languages[i] = languages[i].toUpperCase();
        }
        let query_condition = "(";
        for (let i = 0; i < languages.length; i++) {
            query_condition += "language=?";
            if (i !== languages.length - 1) {
                query_condition += " OR "
            }
        }
        query_condition += ") GROUP BY user_id"
        let rows = this.databaseWrapper.get_all(`SELECT user_id
                                                 FROM ${this.table_name}
                                                 WHERE ${query_condition}`, languages);
        if (rows === undefined) {
            return [];
        } else {
            let speakers = [];
            for (let i = 0; i < rows.length; i++) {
                speakers.push(rows[i].user_id);
            }
            return speakers;
        }
    }

    /**
     * get other users that have same language with given user
     *
     * @param user_id
     * @returns {number[]}
     */
    getUserCanSpeakWith(user_id) {
        let user_languages = this.getUserLanguages(user_id);
        if (user_languages === undefined || user_languages === null || user_languages.length === 0) {
            return [];
        } else {
            let res = this.getUsersWithTheSameLanguages(user_languages);
            let i = res.indexOf(user_id);
            res.splice(i, 1);
            return res;
        }
    }

    /**
     *
     * @param user_id
     */
    deleteUserLanguage(user_id) {
        this.databaseWrapper.run_query(`DELETE
                                        FROM ${this.table_name}
                                        WHERE user_id = ?`, [user_id])
    }

    /**
     *
     * @returns {Map<string, Set>}
     */
    getAllCommonLanguages() {
        let res = this.databaseWrapper.get_all(`SELECT GROUP_CONCAT(user_id),
                                                       language
                                                FROM ${this.table_name}
                                                GROUP BY language`);

        if (res === undefined) {
            return new Map();
        } else {
            let ret_val = new Map();
            for (let i = 0; i < res.length; i++) {
                ret_val.set(res[i].language, new Set());
                let user_ids = res[i]['GROUP_CONCAT(user_id)'].split(',');
                for (let j = 0; j < user_ids.length; j++) {
                    ret_val.get(res[i].language).add(parseInt(user_ids[j]));
                }
            }
            return ret_val;
        }
    }
}

module.exports = UserLanguagesUtils;
