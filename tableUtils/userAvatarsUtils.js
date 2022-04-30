const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class UserAvatarsUtils extends _Row {
    constructor(database) {
        super("user_avatars", database, "user_id");
    }

    updateProfilePic(user_id, original, small) {
        return this.databaseWrapper.run_query(`UPDATE ${this.table_name}
        SET (big_avatar, small_avatar)=(?, ?)
        WHERE user_id=?;`, [original, small, user_id]);
    }

    removeProfilePic(user_id) {
        return this.databaseWrapper.run_query(`UPDATE ${this.table_name}
        SET (big_avatar, small_avatar)=(NULL, NULL)
        WHERE user_id=?;`, [user_id]);
    }

    getSmallProfilePic(user_id) {
        let arr = this.databaseWrapper.get_all(`SELECT (small_avatar) FROM ${this.table_name} WHERE user_id=?;`, [user_id]);
        return arr[0]["small_avatar"];
    }

    getOriginalProfilePic(user_id) {
        let arr = this.databaseWrapper.get_all(`SELECT (big_avatar) FROM ${this.table_name} WHERE user_id=?;`, [user_id]);
        return arr[0]["big_avatar"];
    }
}

module.exports = UserAvatarsUtils;
