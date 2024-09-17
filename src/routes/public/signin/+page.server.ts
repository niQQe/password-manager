import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (user) {
		redirect(303, '/private');
	}

	return { user };
};

export const actions: Actions = {
	signIn: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		console.log('hallå');
		console.log(formData.get('email'));
		console.log(formData.get('master_password'));
		const { data, error } = await supabase.auth.signInWithPassword({
			email: formData.get('email') as string,
			password: formData.get('master_password') as string
		});

		if (error) {
			console.log(error);
			return { error: error.message };
		}

		return { success: true };
	}
};
