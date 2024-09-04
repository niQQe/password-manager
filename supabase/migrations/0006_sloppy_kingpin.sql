CREATE TABLE IF NOT EXISTS "passwords" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"password_hash" text,
	"iv" text,
	"salt" text,
	"created_at" timestamp
);
