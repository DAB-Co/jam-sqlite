BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "accounts" (
	"id"	INTEGER NOT NULL UNIQUE,
	"email"	TEXT UNIQUE,
	"username"	TEXT UNIQUE,
	"password"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "matches" (
	"id"	INTEGER NOT NULL UNIQUE,
	"connections"	BLOB,
	PRIMARY KEY("id"),
	FOREIGN KEY("id") REFERENCES "accounts"("id")
);
CREATE TABLE IF NOT EXISTS "common_preferences" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT UNIQUE,
	"type"	TEXT,
	"user_weights"	BLOB,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "user_preferences" (
	"id"	INTEGER NOT NULL UNIQUE,
	"preferences"	BLOB,
	PRIMARY KEY("id"),
	FOREIGN KEY("id") REFERENCES "accounts"("id")
);
COMMIT;
