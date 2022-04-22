const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class UserAvatarsUtils extends _Row {
    constructor(database) {
        super("user_avatars", database, "user_id");
    }
}

module.exports = UserAvatarsUtils;
