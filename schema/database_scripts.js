const fs = require("fs");
const path = require("path");

const database_scripts = fs.readFileSync(path.join(__dirname, "schema.sql"), {encoding:'utf8', flag:'r'});

const run_command = require(path.join(__dirname, "..", "utils", "run_command.js"));

/**
 *
 * @param dir
 * @param database_name
 * @returns {Promise<void>}
 */
async function create_database(dir, database_name) {
    await fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
    });
    await run_command(`sqlite3 \"${path.join(dir, database_name)}\" --init \"${path.join(__dirname, "schema.sql")}\" < \"${path.join(__dirname, ".exit")}\"`);
}

module.exports = {
    schema: database_scripts,
    create_database: create_database
};
