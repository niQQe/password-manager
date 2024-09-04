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
	},
	signUp: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const { data, error } = await supabase.auth.signUp({
			email: formData.get('email') as string,
			password: formData.get('master_password') as string
		});

		if (error) {
			return { error: error.message };
		}

		const hash = await deriveKey(formData.get('master_password') as string);
		const response = await db
			.insert(userTable)
			.values({ email: formData.get('email'), password_hash: hash } as any);
	},
	savePassword: async ({ request, locals }) => {
		const formData = await request.formData();

		const formObject: Record<string, string | number> = {};

		formData.forEach((value: FormDataEntryValue, key: string) => {
			formObject[key] = value as string;
		});

		const hash = await deriveKey(formObject.password as string);
		await verifyPassword(hash, formObject.password as string);

		const newPassword = {
			password: formObject.password as string
		};

		// const response = await db.insert(passwordsTable).values({ ...newPassword } as any);
	}
};
