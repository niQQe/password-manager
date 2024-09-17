import { pgTable, uuid, timestamp, text, date, integer, boolean } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
	id: uuid('id').primaryKey(),
	userid: text('userid'),
	email: text('email'),
	salt: text('salt'),
	mfa_valid: boolean('mfa_valid'),
	created_at: timestamp('created_at')
});

export const userData = pgTable('user-data', {
	id: uuid('id').primaryKey(),
	userid: text('userid'),
	data: text('data'),
	iv: text('iv'),
	tag: text('tag'),
	changed_at: text('changed_at')
});

export const sharedLinks = pgTable('shared-links', {
	id: integer('id').primaryKey(),
	created_at: timestamp('created_at'),
	linkid: text('linkid'),
	salt: text('salt'),
	data: text('data'),
	expires_at: text('expires_at'),
	iv: text('iv'),
	tag: text('tag'),
	usage_limit: integer('usage_limit')
});
