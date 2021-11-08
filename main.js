const path = require("path");

module.exports = {
    DatabaseWrapper: require(path.join(__dirname, "databaseUtils", "databaseWrapper.js")),
    TableUtils: require(path.join(__dirname, "tableUtils", "tableUtils.js")),
};
