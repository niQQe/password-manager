import type { LayoutServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		redirect(303, '/public/signin');
	}

	await locals.supabase.auth.refreshSession();
	const { data: mfaData } = await locals.supabase.auth.mfa.getAuthenticatorAssuranceLevel();
	if (mfaData?.currentLevel === 'aal2') {
		redirect(303, '/private/passwords');
	}
};
