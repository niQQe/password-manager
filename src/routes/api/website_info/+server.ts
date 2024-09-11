import { json } from '@sveltejs/kit';

export async function GET({ url, locals }) {
	const { user } = (await locals.safeGetSession()) as any;
	if (!user) return json({ message: 'Unauthorized', status: 401 });

	const _url = url.searchParams.get('url');
	try {
		const response = await fetch(_url);
		const html = await response.text();
		const ogTitle = html.match(/<meta property="og:title" content="(.*?)"/)?.[1];
		const ogDescription = html.match(/<meta property="og:description" content="(.*?)"/)?.[1];
		const ogImage = html.match(/<meta property="og:image" content="(.*?)"/)?.[1];
		const ogSiteName = html.match(/<meta property="og:site_name" content="(.*?)"/)?.[1];
		const webdata = {
			logo: ogImage?.replace(/&amp;/g, '&'),
			title: ogTitle,
			siteName: ogSiteName,
			description: ogDescription
		};

		return json(webdata);
	} catch (error: any) {
		return json({ error: error?.message });
	}
}
