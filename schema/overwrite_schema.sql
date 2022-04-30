BEGIN TRANSACTION;
DROP TABLE IF EXISTS "user_friends";
CREATE TABLE IF NOT EXISTS "user_friends"
(
    "user_id" INTEGER NOT NULL UNIQUE,
    "friends" BLOB    NOT NULL DEFAULT '{}',
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id"),
    PRIMARY KEY ("user_id")
);
DROP TABLE IF EXISTS "user_languages";
CREATE TABLE IF NOT EXISTS "user_languages"
(
    "user_id"  INTEGER NOT NULL,
    "language" TEXT,
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id")
);
DROP TABLE IF EXISTS "user_preferences";
CREATE TABLE IF NOT EXISTS "user_preferences"
(
    "user_id"               INTEGER NOT NULL,
    "preference_identifier" TEXT    NOT NULL,
    "preference_weight"     INTEGER DEFAULT 0,
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id")
);
DROP TABLE IF EXISTS "user_connections";
CREATE TABLE "user_connections"
(
    "user1_id" INTEGER NOT NULL,
    "user2_id" INTEGER NOT NULL,
    "weight"   INTEGER DEFAULT 0,
    "matched"  INTEGER DEFAULT 0,
    FOREIGN KEY ("user1_id") REFERENCES "accounts" ("user_id"),
    FOREIGN KEY ("user2_id") REFERENCES "accounts" ("user_id")
);
DROP TABLE IF EXISTS "matches_snapshot";
CREATE TABLE IF NOT EXISTS "matches_snapshot"
(
    "snapshot_id" INTEGER NOT NULL UNIQUE,
    Timestamp     DATETIME,
    "snapshot"    BLOB,
    PRIMARY KEY ("snapshot_id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "spotify";
CREATE TABLE IF NOT EXISTS "spotify"
(
    "user_id"       INTEGER NOT NULL UNIQUE,
    "refresh_token" TEXT,
    PRIMARY KEY ("user_id"),
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id")
);
DROP TABLE IF EXISTS "spotify_preferences";
CREATE TABLE IF NOT EXISTS "spotify_preferences"
(
    "preference_id" TEXT NOT NULL UNIQUE,
    "type"          TEXT,
    "name"          TEXT,
    "raw_data"      BLOB NOT NULL DEFAULT '{}',
    PRIMARY KEY ("preference_id")
);
DROP TABLE IF EXISTS "user_avatars";
CREATE TABLE "user_avatars"
(
    "user_id" INTEGER NOT NULL UNIQUE,
    "big_avatar" BLOB,
    "small_avatar" BLOB,
    PRIMARY KEY ("user_id"),
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id")
);
DROP TABLE IF EXISTS "user_devices";
CREATE TABLE IF NOT EXISTS "user_devices"
(
    "user_id" INTEGER NOT NULL UNIQUE,
    "device_id" TEXT,
    PRIMARY KEY ("user_id"),
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id")
);
DROP TABLE IF EXISTS "accounts";
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
DROP TRIGGER  IF EXISTS after_account_insert;
CREATE TRIGGER after_account_insert
    AFTER INSERT
    ON accounts
BEGIN
    INSERT INTO user_friends (user_id) VALUES (new.user_id);
    INSERT INTO spotify(user_id) VALUES (new.user_id);
    INSERT INTO user_avatars(user_id) VALUES (new.user_id);
    INSERT INTO user_devices(user_id) VALUES (new.user_id);
END;
DROP TRIGGER IF EXISTS before_account_delete;
CREATE TRIGGER before_account_delete
    BEFORE DELETE
    ON accounts
BEGIN
    DELETE FROM user_friends WHERE user_id=old.user_id;
    DELETE FROM spotify WHERE user_id=old.user_id;
    DELETE FROM user_avatars WHERE user_id=old.user_id;
    DELETE FROM user_devices WHERE user_id=old.user_id;
    DELETE FROM user_connections WHERE user1_id = old.user_id OR user2_id = old.user_id;
END;
DROP TRIGGER IF EXISTS "before_user_languages_insert";
CREATE TRIGGER before_user_languages_insert
    BEFORE INSERT
    ON user_languages
BEGIN
    SELECT RAISE(ABORT, 'this language for this user exists')
    WHERE EXISTS(
                  SELECT 1
                  FROM user_languages
                  WHERE new.user_id = user_id
                    AND new.language = language
              );
END;
DROP TRIGGER IF EXISTS "before_user_preferences_insert";
CREATE TRIGGER before_user_preferences_insert
    BEFORE INSERT
    ON user_preferences
BEGIN
    SELECT RAISE(ABORT, 'this preference exists')
    WHERE EXISTS(
                  SELECT 1
                  FROM user_preferences
                  WHERE new.user_id = user_id
                    AND new.preference_identifier = preference_identifier
              );
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
CREATE TRIGGER insert_Timestamp_Trigger
    AFTER INSERT ON matches_snapshot
BEGIN
    UPDATE matches_snapshot SET Timestamp =STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE snapshot_id = new.snapshot_id;
END;

CREATE TRIGGER update_Timestamp_Trigger
    AFTER UPDATE On matches_snapshot
BEGIN
    UPDATE matches_snapshot SET Timestamp = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE snapshot_id = new.snapshot_id;
END;
COMMIT;
