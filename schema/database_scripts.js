const fs = require("fs");
const path = require("path");

const { exec} = require('child_process');

const database_scripts = fs.readFileSync(path.join(__dirname, "schema.sql"), {encoding:'utf8', flag:'r'});

function run_command(command) {
    return new Promise(function (resolve, reject) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(stdout);
            }
        });
    });
}

async function create_database(dir) {
    await fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
    });
    await run_command(`sqlite3 sqlite\\database.db --init \"${path.join(__dirname, "schema.sql")}\" < \"${path.join(__dirname, ".exit")}\"`);
}

module.exports = {
    schema: database_scripts,
    create_database: create_database
};
