CREATE TABLE IF NOT EXISTS "passwords" (
	"id" uuid PRIMARY KEY NOT NULL,
	"password_hash" text,
	"salt" text,
	"created_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "password";