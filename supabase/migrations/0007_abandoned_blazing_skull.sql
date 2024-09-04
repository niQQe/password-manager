ALTER TABLE "passwords" ADD COLUMN "userid" text;--> statement-breakpoint
ALTER TABLE "passwords" ADD COLUMN "encypted_password" text;--> statement-breakpoint
ALTER TABLE "passwords" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
ALTER TABLE "passwords" DROP COLUMN IF EXISTS "password_hash";