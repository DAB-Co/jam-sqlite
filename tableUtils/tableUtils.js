const path = require("path");

module.exports = {
    AccountUtils: require(path.join(__dirname, "accountUtils.js")),
    ArtistUtils: require(path.join(__dirname, "artistsUtils.js")),
    MatchesUtils: require(path.join(__dirname, "matchesUtils.js")),
    TableUtils: require(path.join(__dirname, "tableUtils.js")),
    TrackUtils: require(path.join(__dirname, "tracksUtils.js")),
    UserPreferencesUtils: require(path.join(__dirname, "userPreferencesUtils.js")),
};
