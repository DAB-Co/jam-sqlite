const exec = require('child_process').exec;

/**
 *
 * @param command
 * @returns {Promise<string>}
 */
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

module.exports = run_command;
