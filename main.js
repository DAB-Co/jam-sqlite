const path = require("path");

module.exports = {
    Database: require(path.join(__dirname, "databaseUtils", "databaseWrapper.js")),
    Utils: require(path.join(__dirname, "tableUtils", "tableUtils.js")),
    database_scripts: require(path.join(__dirname, "schema", "database_scripts.js")),
};
