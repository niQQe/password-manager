import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/db/index.js';
import { eq } from 'drizzle-orm';
import { userTable } from '$lib/db/schema.js';
import crypto from 'crypto';

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

export const actions: Actions = {
	checkEmail: async ({ request, locals }) => {
		const formData = await request.formData();
		const user = await db.query.userTable.findMany({
			where: eq(userTable.email, formData.get('email') as string)
		});

		console.log(user);
		if (user.length) {
			return { emailExists: true };
		} else {
			return { emailExists: false };
		}
	},
	signUp: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const { data, error } = await supabase.auth.signUp({
			email: formData.get('email') as string,
			password: formData.get('master_password') as string
		});

		if (error) {
			console.log(error);
			return { error: error.message };
		}

		try {
			const response = await db.insert(userTable).values({
				email: formData.get('email'),
				userid: data.user?.id,
				salt: Buffer.from(crypto.randomBytes(16).toString('base64')).toString('base64')
			} as any);

			console.log();

			return { success: true };
		} catch (error) {
			return { error: error.message };
		}
	}
};
