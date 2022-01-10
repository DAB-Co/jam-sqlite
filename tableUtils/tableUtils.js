const path = require("path");

module.exports = {
    AccountUtils: require(path.join(__dirname, "accountUtils.js")),
    UserFriendsUtils: require(path.join(__dirname, "userFriendsUtils.js")),
};
