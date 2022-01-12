const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), {encoding:'utf8', flag:'r'});
const overwrite_schema = fs.readFileSync(path.join(__dirname, "overwrite_schema.sql"), {encoding:'utf8', flag:'r'});

/**
 * create the database, but do not drop the tables
 *
 * @param db_path
 */
function create_database(db_path) {
    let raw_database = new Database(db_path);
    raw_database.exec(schema);
}

/**
 * create the database and drop the tables
 *
 * @param db_path
 */
function overwrite_database(db_path) {
    let raw_database = new Database(db_path);
    raw_database.exec(overwrite_schema);
}

module.exports = {
    schema: schema,
    overwrite_schema: overwrite_schema,
    create_database: create_database,
    overwrite_database: overwrite_database,
};
