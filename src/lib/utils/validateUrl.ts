export function validateUrl(url: string): boolean {
	// Define the regex for URL validation
	const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

	// Add or replace the protocol
	if (!/^https?:\/\//i.test(url)) {
		url = 'https://' + url; // Add https:// if no protocol is present
	} else if (/^http:\/\//i.test(url)) {
		url = url.replace(/^http:\/\//i, 'https://'); // Replace http:// with https://
	}
	// Validate the URL
	return urlRegex.test(url);
}
