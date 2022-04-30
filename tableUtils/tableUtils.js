const path = require("path");

const AccountUtils = require(path.join(__dirname, "accountUtils.js"));
const UserFriendsUtils = require(path.join(__dirname, "userFriendsUtils.js"));
const UserLanguagesUtils = require(path.join(__dirname, "userLanguagesUtils.js"));
const UserPreferencesUtils = require(path.join(__dirname, "userPreferencesUtils.js"));
const SpotifyUtils = require(path.join(__dirname, "spotifyUtils.js"));
const SpotifyPreferencesUtils = require(path.join(__dirname, "spotifyPreferencesUtils.js"));
const MatchesSnapshotUtils = require(path.join(__dirname, "matchesSnapshotUtils.js"));
const UserAvatarsUtils = require(path.join(__dirname, "userAvatarsUtils.js"));
const UserDevicesUtils = require(path.join(__dirname, "userDevicesUtils.js"));

/**
 * initializes all the utils and returns instances
 */
class UtilsInitializer {
    constructor(database) {
        this.accountUtilsObject = new AccountUtils(database);
        this.userFriendsUtilsObject = new UserFriendsUtils(database);
        this.userLanguagesUtilsObject = new UserLanguagesUtils(database);
        this.userPreferencesUtilsObject = new UserPreferencesUtils(database);
        this.spotifyUtilsObject = new SpotifyUtils(database);
        this.spotifyPreferencesUtilsObject = new SpotifyPreferencesUtils(database);
        this.matchesSnapshotUtilsObject = new MatchesSnapshotUtils(database);
        this.userAvatarsUtilsObject = new UserAvatarsUtils(database);
        this.userDevicesUtilsObject = new UserDevicesUtils(database);
    }

    accountUtils() {
        return this.accountUtilsObject;
    }

    userFriendsUtils() {
        return this.userFriendsUtilsObject;
    }

    userLanguagesUtils() {
        return this.userLanguagesUtilsObject;
    }

    userPreferencesUtils() {
        return this.userPreferencesUtilsObject;
    }

    spotifyUtils() {
        return this.spotifyUtilsObject;
    }

    spotifyPreferencesUtils() {
        return this.spotifyPreferencesUtilsObject;
    }

    matchesSnapshotUtils() {
        return this.matchesSnapshotUtilsObject;
    }

    userAvatarsUtils() {
        return this.userAvatarsUtilsObject;
    }

    userDevicesUtils() {
        return this.userDevicesUtilsObject;
    }
}

module.exports = {
    UtilsInitializer: UtilsInitializer,
    AccountUtils: AccountUtils,
    UserFriendsUtils: UserFriendsUtils,
    UserLanguagesUtils: UserLanguagesUtils,
    UserPreferencesUtils: UserPreferencesUtils,
    SpotifyUtils: SpotifyUtils,
    SpotifyPreferencesUtils: SpotifyPreferencesUtils,
    MatchesSnapshotUtils: MatchesSnapshotUtils,
    UserAvatarsUtils: UserAvatarsUtils,
    UserDevicesUtils: UserDevicesUtils,
};
