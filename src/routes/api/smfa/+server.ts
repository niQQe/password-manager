// api endpoint for ressetting mfa
import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { userTable } from '$lib/db/schema';

import { eq } from 'drizzle-orm';

export async function POST({ locals, request }) {
	const { params } = request;
	// get body
	const body = await request.json();

	console.log(body);
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
		.set({ mfa_valid: body.status })
		.where(eq(userTable.userid, user.id))
		.returning();

	// return response
	return new Response(JSON.stringify({}), {
		status: 200,
		statusText: 'OK',
		headers: { 'Content-Type': 'application/json' }
	});
}
