CREATE TABLE IF NOT EXISTS "userDataTable" (
	"id" uuid PRIMARY KEY NOT NULL,
	"data" text
);
--> statement-breakpoint
DROP TABLE "passwords";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "data";