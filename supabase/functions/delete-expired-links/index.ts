import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
	try {
		const supabase = createClient(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_ANON_KEY') ?? ''
		);

		const currentTime = new Date();

		// Fetch rows where expires_at is in the past
		const { data, error } = await supabase.from('shared-links').select('*');

		if (error) {
			console.error('Error fetching data:', error);
			return new Response(JSON.stringify({ error: error.message }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Filter out any rows that might not have parsed correctly
		const expiredRows = data.filter((row) => {
			if (!row.expires_at) return false; // Skip rows without an expiry date
			const date = new Date(row.expires_at);
			const utcDate = new Date(date.toUTCString());
			const expiryDate = new Date(utcDate.toISOString());
			return currentTime > expiryDate;
		});

		// Delete the expired rows
		if (expiredRows.length > 0) {
			const { error: deleteError } = await supabase
				.from('shared-links')
				.delete()
				.in(
					'id',
					expiredRows.map((row) => row.id)
				);

			if (deleteError) {
				console.error('Error deleting data:', deleteError);
				return new Response(JSON.stringify({ error: deleteError.message }), {
					status: 500,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}

		return new Response(
			JSON.stringify({
				message: `Successfully deleted ${expiredRows.length} expired rows`,
				deletedRows: expiredRows
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (error) {
		console.error('Unexpected error:', error);
		return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
});
