import type { LayoutServerLoad, Actions } from './$types';
import { userData, sharedLinks } from '$lib/db/schema';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import dayjs from 'dayjs';

function getExpireDate(value: string) {
	switch (value) {
		case '1':
			return dayjs().add(1, 'minute').toDate();
		case '2':
			return dayjs().add(1, 'hour').toDate();
		case '3':
			return dayjs().add(1, 'day').toDate();
		case '4':
			return dayjs().add(1, 'week').toDate();
		case '5':
			return dayjs().add(1, 'month').toDate();
	}
}

export const load: LayoutServerLoad = async ({ locals, params }) => {
	const { user } = (await locals.safeGetSession()) as any;
	if (!user) return { status: 401, body: { message: 'Unauthorized' } };

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
	modifyItem: async ({ request, locals }) => {
		const { user } = (await locals.safeGetSession()) as any;
		if (!user) return { status: 401, body: { message: 'Unauthorized' } };

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
	},
	createSharedLink: async ({ request, locals }) => {
		const { user } = (await locals.safeGetSession()) as any;
		if (!user) return { status: 401, body: { message: 'Unauthorized' } };
		const formData = await request.formData();
		const data = { ...Object.fromEntries(formData) };

		const expireOption = formData.get('expires_at') as string;

		const expireAt = getExpireDate(expireOption) ?? null;

		try {
			await db.insert(sharedLinks).values({
				...data,
				...(expireAt ? { expires_at: String(expireAt) } : {})
			} as any);
			return {
				status: 200,
				body: { linkid: data.linkid }
			};
		} catch (e) {
			console.log('Error creating shared link');
			console.log(e);
		}
	}
};
