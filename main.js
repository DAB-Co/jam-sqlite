const path = require("path");

module.exports = {
    DatabaseWrapper:  require(path.join(__dirname, "db", "databaseWrapper.js")),
    DatabaseUtils: require(path.join(__dirname, "db", "databaseUtils.js")),
};
