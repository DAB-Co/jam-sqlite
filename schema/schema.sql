BEGIN TRANSACTION;
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
CREATE TABLE IF NOT EXISTS "user_friends"
(
    "user_id" INTEGER NOT NULL UNIQUE,
    "friends" BLOB,
    PRIMARY KEY ("user_id"),
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id")
);
CREATE TABLE IF NOT EXISTS "user_languages"
(
    "user_id"  INTEGER NOT NULL,
    "language" TEXT,
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id")
);
CREATE TABLE IF NOT EXISTS "user_preferences"
(
    "user_id"               INTEGER NOT NULL,
    "preference_type"       TEXT,
    "preference_identifier" TEXT,
    FOREIGN KEY ("user_id") REFERENCES "accounts" ("user_id")
);
CREATE TABLE IF NOT EXISTS "user_connections"
(
    "user_id1" INTEGER NOT NULL,
    "user_id2" INTEGER NOT NULL,
    "weight"   INTEGER NOT NULL,
    FOREIGN KEY ("user_id1") REFERENCES "accounts" ("user_id"),
    FOREIGN KEY ("user_id2") REFERENCES "accounts" ("user_id")
);
COMMIT;
