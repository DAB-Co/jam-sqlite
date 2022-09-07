const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"));


class YoutubeUtils extends _Row{
    constructor(database) {
        super("youtube", database, "user_id");
    }

    updateRefreshToken(user_id, refresh_token) {
        this.updateColumnByPrimaryKey(user_id, "refresh_token", refresh_token);
    }

    /**
     *
     * @param user_id
     * @returns {undefined|string}
     */
    getRefreshToken(user_id) {
        return this.getColumnByPrimaryKey(user_id, "refresh_token");
    }

    /**
     *
     * @param user_id
     */
    deleteRefreshToken(user_id) {
        this.databaseWrapper.run_query(`DELETE FROM ${this.table_name} WHERE ${this.primary_key} = ?`,[user_id])
    }
}

module.exports = YoutubeUtils;
