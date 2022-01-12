BEGIN TRANSACTION;
DROP TABLE IF EXISTS "user_friends";
CREATE TABLE IF NOT EXISTS "user_friends"
(
    "user_id" INTEGER NOT NULL UNIQUE,
    "friends" BLOB,
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
    "user_id"                      INTEGER NOT NULL,
    "preference_type"              TEXT,
    "preference_identifier"        TEXT,
    "preference_type_weight"       INTEGER DEFAULT 0,
    "preference_identifier_weight" INTEGER DEFAULT 0,
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id")
);
DROP TABLE IF EXISTS "user_connections";
CREATE TABLE IF NOT EXISTS "user_connections"
(
    "user1_id" INTEGER NOT NULL,
    "user2_id" INTEGER NOT NULL,
    "weight"   INTEGER DEFAULT 0,
    "matched"  INTEGER DEFAULT 0,
    FOREIGN KEY ("user1_id") REFERENCES "accounts" ("user_id"),
    FOREIGN KEY ("user2_id") REFERENCES "accounts" ("user_id")
);

DROP TABLE IF EXISTS "accounts";
CREATE TABLE IF NOT EXISTS "accounts"
(
    "user_id"                 INTEGER NOT NULL UNIQUE,
    "user_email"              TEXT UNIQUE,
    "username"                TEXT UNIQUE,
    "user_password_hash"      TEXT,
    "user_notification_token" TEXT,
    "user_api_token"          TEXT,
    PRIMARY KEY ("user_id" AUTOINCREMENT)
);
COMMIT;
