const path = require("path");

module.exports = {
    AccountUtils: require(path.join(__dirname, "accountUtils.js")),
    MatchesUtils: require(path.join(__dirname, "matchesUtils.js")),
    TableUtils: require(path.join(__dirname, "tableUtils.js")),
    UserPreferencesUtils: require(path.join(__dirname, "userPreferencesUtils.js")),
    CommonPreferencesUtils: require(path.join(__dirname, "commonPreferencesUtils.js")),
    UserFriendsUtils: require(path.join(__dirname, "userFriendsUtils.js")),
};
