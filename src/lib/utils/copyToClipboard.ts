export function copyToClipboard(text: string) {
	if (!text || typeof text !== 'string') {
		throw new Error('copyToClipboard requires a string argument');
	}
	navigator.clipboard.writeText(text);
}
