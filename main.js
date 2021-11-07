const path = require("path");

module.exports = {
    Database:  require(path.join(__dirname, "db", "Database.js")),
    Utils: require(path.join(__dirname, "db", "DbUtils.js")),
};
