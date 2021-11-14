const path = require("path");
const _Row = require(path.join(__dirname, "_row.js"))

class ArtistsUtils extends _Row{
    constructor(databaseWrapper) {
        super("artists", databaseWrapper);
    }
}

module.exports = ArtistUtils;