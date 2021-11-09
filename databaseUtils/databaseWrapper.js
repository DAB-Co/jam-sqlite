const Database = require('better-sqlite3');

class DatabaseWrapper {
    constructor(database_path, options = {
        readonly: false,
        fileMustExist: true,
        timeout: 5000,
        verbose: null
    }) {
        this.database = new Database(database_path, options);
    }

    prepare(sql) {
        return this.database.prepare(sql);
    }

    get(sql, params=[]) {
        return this.prepare(sql).get(params);
    }

    get_all(sql, params=[]) {
        return this.prepare(sql).all(params);
    }

    run_query(sql, params=[]) {
        return this.prepare(sql).run(params);
    }
}

module.exports = DatabaseWrapper;
