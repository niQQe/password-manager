ALTER TABLE "users" RENAME COLUMN "email" TO "data";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "data" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "userid" text;