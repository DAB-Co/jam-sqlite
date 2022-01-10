const path = require("path");

module.exports = {
    AccountUtils: require(path.join(__dirname, "accountUtils.js")),
    UserFriendsUtils: require(path.join(__dirname, "userFriendsUtils.js")),
    UserLanguagesUtils: require(path.join(__dirname, "userLanguagesUtils.js")),
    UserConnectionsUtils: require(path.join(__dirname, "userConnectionsUtils.js")),
};
