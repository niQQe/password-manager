import type { LayoutServerLoad, Actions } from './$types';
import { userData } from '$lib/db/schema';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	const { user } = (await locals.safeGetSession()) as any;
	if (!user) return { user: null };
	const items = await db.query.userData.findFirst({
		where: eq(userData.userid, user.id)
	});

	const salt = (
		await db.query.userTable.findFirst({
			where: eq(userData.userid, user.id)
		})
	)?.salt;

	return {
		salt,
		items
	};
};

export const actions: Actions = {
	addItem: async ({ request, locals }) => {
		const { user } = (await locals.safeGetSession()) as any;

		const formData = await request.formData();

		const data = { ...Object.fromEntries(formData) };

		const existingRow = await db.query.userData.findFirst({
			where: eq(userData.userid, user.id)
		});

		if (existingRow) {
			await db.update(userData).set(data).where(eq(userData.userid, user.id)).returning();
		} else {
			await db.insert(userData).values({
				userid: user.id,
				...data
			} as any);
		}
	}
};
