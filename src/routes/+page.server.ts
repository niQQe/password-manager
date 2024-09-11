import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/db/index.js';
import { eq } from 'drizzle-orm';
import { userTable } from '$lib/db/schema.js';
import { deriveKey } from '$lib/encryption/crypto';

export const actions: Actions = {
	checkEmail: async ({ request, locals }) => {
		const formData = await request.formData();

		const formObject: Record<string, string | number> = {};

		formData.forEach((value: FormDataEntryValue, key: string) => {
			formObject[key] = value as string;
		});

		const user = await db.query.userTable.findMany({
			where: eq(userTable.email, String(formData.get('email')))
		});

		return { emailExists: user.length > 0 };
	}
};
