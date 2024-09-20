import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { userDataTable } from '$lib/db/schema';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		redirect(303, '/public/signin');
	}

	await locals.supabase.auth.refreshSession();
	const { data: mfaData } = await locals.supabase.auth.mfa.getAuthenticatorAssuranceLevel();

	const isMFAverified = mfaData?.currentLevel === 'aal2';

	if (isMFAverified) {
		const userData = await db.query.userDataTable.findFirst({
			where: eq(userDataTable.userid, user.id)
		});

		const salt = (
			await db.query.userTable.findFirst({
				where: eq(userDataTable.userid, user.id)
			})
		)?.salt;

		return {
			salt,
			userData
		};
	}

	const hasNotEnrolled = mfaData?.currentLevel === 'aal1' && mfaData.nextLevel === 'aal1';
	const hasNotVerified = mfaData?.currentLevel === 'aal1' && mfaData.nextLevel === 'aal2';

	if (hasNotVerified) {
		redirect(303, '/auth/mfa/auth');
	}
	if (hasNotEnrolled) {
		redirect(303, '/auth/mfa/enroll');
	}
};
