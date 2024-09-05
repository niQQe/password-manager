import { json } from '@sveltejs/kit';

export async function GET({ url, locals }) {
	const _url = url.searchParams.get('url');
	try {
		const response = await fetch(_url);
		const html = await response.text();
		console.log(html);
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

		console.log(webdata);

		return json(webdata);
	} catch (error) {
		console.error('Error fetching HTML:', error);
		throw error; // Re-throw the error after logging it
	}
}
