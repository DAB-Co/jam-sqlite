const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class UserAvatarsUtils extends _Row {
    constructor(database) {
        super("user_avatars", database, "user_id");
    }

    hasProfilePic(user_id) {
        let arr = this.databaseWrapper.run_query(`SELECT 1 FROM ${this.table_name} WHERE user_id=?;`, [user_id]);
        return arr.length != 0;
    }

    addProfilePic(user_id, original, small) {
        this.databaseWrapper.run_query(`INSERT INTO ${this.table_name} VALUES (?, ?, ?);`, [user_id, original, small]);
    }

    updateProfilePic(user_id, original, small) {
        this.databaseWrapper.run_query(`UPDATE ${this.table_name}
        SET (big_avatar, small_avatar)=(?, ?)
        WHERE user_id=?;`, [original, small, user_id]);
    }

    removeProfilePic(user_id) {
        this.databaseWrapper.run_query(`DELETE FROM ${this.table_name} WHERE user_id=?;`, [user_id]);
    }

    getSmallProfilePic(user_id) {
        this.databaseWrapper.run_query(`SELECT (small_avatar) FROM ${this.table_name} WHERE user_id=?;`, [user_id]);
    }

    getOriginalProfilePic(user_id) {
        this.databaseWrapper.run_query(`SELECT (big_avatar) FROM ${this.table_name} WHERE user_id=?;`, [user_id]);
    }
}

module.exports = UserAvatarsUtils;
