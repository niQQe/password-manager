CREATE TABLE IF NOT EXISTS "passwords" (
	"id" uuid PRIMARY KEY NOT NULL,
	"password" text,
	"created_at" timestamp
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"password_hash" text,
	"created_at" timestamp
);

