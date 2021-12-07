BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "accounts" (
	"user_id"	INTEGER NOT NULL UNIQUE,
	"user_email"	TEXT UNIQUE,
	"username"	TEXT UNIQUE,
	"user_password_hash"	TEXT,
	"notification_token" TEXT,
	PRIMARY KEY("user_id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "matches" (
	"user_id"	INTEGER NOT NULL UNIQUE,
	"user_connections"	BLOB,
	FOREIGN KEY("user_id") REFERENCES "accounts"("user_id"),
	PRIMARY KEY("user_id")
);
CREATE TABLE IF NOT EXISTS "common_preferences" (
	"preference_id"	INTEGER NOT NULL UNIQUE,
	"preference_name"	TEXT,
	"preference_type"	TEXT,
	"user_weights"	BLOB,
	PRIMARY KEY("preference_id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "user_preferences" (
	"user_id"	INTEGER NOT NULL UNIQUE,
	"user_preferences"	BLOB,
	"exclude"	INTEGER DEFAULT 0,
	FOREIGN KEY("user_id") REFERENCES "accounts"("user_id"),
	PRIMARY KEY("user_id")
);
COMMIT;
