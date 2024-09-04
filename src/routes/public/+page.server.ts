import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/db/index.js';
import { eq } from 'drizzle-orm';
import { userTable } from '$lib/db/schema.js';

export const load = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	// if (!user) {
	// 	return { user: null };
	// }

	// const exercises = await db.query.passwordsTable.findMany({
	// 	where: eq(passwordsTable.userid, user.id),
	// 	orderBy: passwordsTable.created_at
	// });

	return { user };
};

export const actions: Actions = {};
