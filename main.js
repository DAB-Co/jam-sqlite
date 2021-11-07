const path = require("path");

module.exports = {
    Database:  require(path.join(__dirname, "db", "databaseWrapper.js")),
    Utils: require(path.join(__dirname, "db", "dbUtils.js")),
};
