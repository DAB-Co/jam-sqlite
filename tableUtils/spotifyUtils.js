const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class SpotifyUtils extends _Row{
    constructor(database) {
        super("spotify", database, "user_id");
    }

    /**
     *
     * @param user_id
     * @param refresh_token
     */
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
}

module.exports = SpotifyUtils;
