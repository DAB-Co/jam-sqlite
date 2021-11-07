const sqlite3 = require('sqlite3').verbose();

class Database {
    constructor(database_path) {
        this.database = new sqlite3.Database(database_path, (error) => {
            if (error) {
                console.error(error.message);
            } else {
                console.log('Connected to SQlite database.');
            }
        });
    }

    run_query(sql, params = []) {
        let db = this.database;
        return new Promise(function (resolve, reject) {
            db.all(sql, params, function (error, rows) {
                if (error)
                    reject(error);
                else
                    resolve(rows);
            });
        });
    }
}

module.exports = Database;
