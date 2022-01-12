const Database = require('better-sqlite3');

class DatabaseWrapper {
    /**
     *
     * @param database_path
     * @param options
     */
    constructor(database_path, options = {
        readonly: false,
        fileMustExist: true,
        timeout: 5000,
        verbose: null
    }) {
        this.database = new Database(database_path, options);
    }

    /**
     *
     * @param sql
     * @returns {*}
     */
    prepare(sql) {
        return this.database.prepare(sql);
    }

    /**
     *
     * @param sql
     * @param params
     * @returns {*}
     */
    get(sql, params=[]) {
        return this.prepare(sql).get(params);
    }

    /**
     *
     * @param sql
     * @param params
     * @returns {*}
     */
    get_all(sql, params=[]) {
        return this.prepare(sql).all(params);
    }

    /**
     *
     * @param sql
     * @param params
     * @returns {any}
     */
    run_query(sql, params=[]) {
        return this.prepare(sql).run(params);
    }
}

module.exports = DatabaseWrapper;
