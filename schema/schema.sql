BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "accounts"
(
    "user_id"                 INTEGER NOT NULL UNIQUE,
    "user_email"              TEXT    NOT NULL UNIQUE,
    "username"                TEXT    NOT NULL UNIQUE,
    "user_password_hash"      TEXT    NOT NULL,
    "user_notification_token" TEXT,
    "user_api_token"          TEXT,
    PRIMARY KEY ("user_id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "user_friends"
(
    "user_id"   INTEGER NOT NULL,
    "friend_id" INTEGER NOT NULL,
    "blocked"   BOOLEAN NOT NULL DEFAULT FALSE,
    "been_blocked" BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id"),
    FOREIGN KEY ("friend_id") REFERENCES "accounts" ("user_id"),
    PRIMARY KEY ("user_id", "friend_id"),
    CHECK ("user_id" != "friend_id")
);
CREATE TABLE IF NOT EXISTS "user_languages"
(
    "user_id"  INTEGER NOT NULL,
    "language" TEXT,
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id"),
    PRIMARY KEY ("user_id", "language")
);
CREATE TABLE IF NOT EXISTS "user_preferences"
(
    "user_id"               INTEGER NOT NULL,
    "preference_identifier" TEXT    NOT NULL,
    "preference_weight"     INTEGER DEFAULT 0,
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id"),
    PRIMARY KEY ("user_id", "preference_identifier")
);
CREATE TABLE IF NOT EXISTS "user_connections"
(
    "user1_id" INTEGER NOT NULL,
    "user2_id" INTEGER NOT NULL,
    "weight"   INTEGER DEFAULT 0,
    "matched"  INTEGER DEFAULT 0,
    FOREIGN KEY ("user1_id") REFERENCES "accounts" ("user_id"),
    FOREIGN KEY ("user2_id") REFERENCES "accounts" ("user_id"),
    PRIMARY KEY ("user1_id", "user2_id"),
    CHECK ("user1_id" != "user2_id")
);
CREATE TABLE IF NOT EXISTS "spotify"
(
    "user_id"       INTEGER NOT NULL UNIQUE,
    "refresh_token" TEXT,
    PRIMARY KEY ("user_id"),
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id")
);
CREATE TABLE IF NOT EXISTS "spotify_preferences"
(
    "preference_id" TEXT NOT NULL UNIQUE,
    "type"          TEXT,
    "name"          TEXT,
    "raw_data"      BLOB NOT NULL DEFAULT '{}',
    PRIMARY KEY ("preference_id")
);
CREATE TABLE IF NOT EXISTS "user_avatars"
(
    "user_id"      INTEGER NOT NULL UNIQUE,
    "big_avatar"   BLOB,
    "small_avatar" BLOB,
    PRIMARY KEY ("user_id"),
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id")
);
CREATE TABLE IF NOT EXISTS "user_devices"
(
    "user_id"   INTEGER NOT NULL UNIQUE,
    "device_id" TEXT,
    PRIMARY KEY ("user_id"),
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id")
);
DROP TRIGGER IF EXISTS after_account_insert;
CREATE TRIGGER after_account_insert
    AFTER INSERT
    ON accounts
BEGIN
    INSERT INTO spotify(user_id) VALUES (new.user_id);
    INSERT INTO user_avatars(user_id) VALUES (new.user_id);
    INSERT INTO user_devices(user_id) VALUES (new.user_id);
END;
DROP TRIGGER IF EXISTS before_account_delete;
CREATE TRIGGER before_account_delete
    BEFORE DELETE
    ON accounts
BEGIN
    DELETE FROM user_friends WHERE user_id = old.user_id OR friend_id = old.user_id;
    DELETE FROM spotify WHERE user_id = old.user_id;
    DELETE FROM user_avatars WHERE user_id = old.user_id;
    DELETE FROM user_devices WHERE user_id = old.user_id;
    DELETE FROM user_connections WHERE user1_id = old.user_id OR user2_id = old.user_id;
END;
DROP TRIGGER IF EXISTS after_user_preferences_insert;
CREATE TRIGGER after_user_preferences_insert
    AFTER INSERT
    ON user_preferences
    WHEN NOT EXISTS(SELECT 1
                    FROM spotify_preferences
                    WHERE preference_id = new.preference_identifier)
BEGIN
    INSERT INTO spotify_preferences(preference_id) VALUES (new.preference_identifier);
END;
DROP TRIGGER IF EXISTS before_user_connections_insert;
CREATE TRIGGER before_user_connections_insert
    BEFORE INSERT
    ON user_connections
BEGIN
    SELECT CASE
               WHEN new.user1_id = new.user2_id
                   THEN RAISE(ABORT, 'user1_id cant equal to user2_id')
               END;
    SELECT RAISE(ABORT, 'this connection exists')
    WHERE EXISTS(
                  SELECT 1
                  FROM user_connections
                  WHERE (new.user1_id = user1_id AND new.user2_id = user2_id)
                     OR (new.user1_id = user2_id AND new.user2_id = user1_id)
              );
END;
COMMIT;
