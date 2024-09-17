async function sha1(password: string) {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-1', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')
		.toUpperCase();
	return hashHex;
}

// Function to check the password with HIBP API
export async function checkPassword(password: string) {
	const sha1Hash = await sha1(password);
	const hashPrefix = sha1Hash.substring(0, 5);
	const hashSuffix = sha1Hash.substring(5);

	// Query the HIBP API for the hash prefix
	const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
	const body = await response.text();

	// Check if the hash suffix exists in the API response
	const leaks = body.split('\n').map((line) => {
		const [hash, count] = line.split(':');
		return { hash: hash.trim(), count: parseInt(count, 10) };
	});

	const leak = leaks.find((entry) => entry.hash === hashSuffix);
	if (leak) {
		return `Password found in ${leak.count} breaches!`;
	} else {
		return 'Password not found in any breaches.';
	}
}
