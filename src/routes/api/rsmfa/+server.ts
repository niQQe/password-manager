// api endpoint for ressetting mfa
import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { userTable } from '$lib/db/schema';

import { eq } from 'drizzle-orm';

export async function POST({ locals, request }) {
	const { params } = request;
	console.log(params);
	const { user } = await locals.safeGetSession();
	if (!user) {
		return {
			status: 401,
			body: {
				message: 'Unauthorized'
			}
		};
	}

	// update userTable
	const res = await db
		.update(userTable)
		.set({ mfa_valid: false })
		.where(eq(userTable.userid, user.id))
		.returning();
}
