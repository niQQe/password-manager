CREATE TABLE IF NOT EXISTS "passwords" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userid" text,
	"website" text,
	"encrypted_password" text,
	"iv" text,
	"salt" text,
	"created_at" timestamp
);
