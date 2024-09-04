import { Buffer } from 'buffer';

async function deriveKey(pass: string, salt: string, argon2: any) {
	const { encoded } = await argon2.hash({
		salt: Buffer.from(salt),
		raw: false,
		pass,
		time: 2,
		hashLen: 32,
		type: argon2.ArgonType.Argon2id
	});

	const [, , , , , key] = encoded.split('$');
	return key;
}

export async function encrypt(
	{ masterPassword, data, salt }: { masterPassword: string; data: string; salt: string },
	argon2: any,
	crypto: any
) {
	const derivedKey = await deriveKey(masterPassword, salt, argon2);

	const bufferedKey = Buffer.from(derivedKey, 'base64');

	const iv = crypto.getRandomValues(new Uint8Array(12));

	const key = await crypto.subtle.importKey('raw', bufferedKey, 'AES-GCM', false, [
		'encrypt',
		'decrypt'
	]);

	// Convert the plaintext password to an ArrayBuffer
	const encoder = new TextEncoder();
	const dataBuffer = encoder.encode(data);

	// Perform the encryption using AES-GCM
	const encryptedBuffer = await crypto.subtle.encrypt(
		{
			name: 'AES-GCM',
			iv: iv
		},
		key,
		dataBuffer
	);

	// Convert the encrypted buffer to a Uint8Array
	const encryptedArray = new Uint8Array(encryptedBuffer);

	// Extract the tag (last 16 bytes)
	const tag = encryptedArray.slice(-16);
	const ciphertextWithoutTag = encryptedArray.slice(0, -16);

	// Convert the ciphertext and tag to base64
	const encryptedData = btoa(String.fromCharCode(...ciphertextWithoutTag));
	const tagBase64 = btoa(String.fromCharCode(...tag));

	return {
		encryptedData,
		iv: btoa(String.fromCharCode(...iv)),
		tag: tagBase64
	};
}

export async function decrypt(
	{
		masterPassword,
		salt,
		data,
		ivBase64,
		tagBase64
	}: {
		masterPassword: string;
		data: string;
		salt: string;
		ivBase64: string;
		tagBase64: string;
	},
	argon2: any,
	crypto: any
) {
	const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));
	const tag = Uint8Array.from(atob(tagBase64), (c) => c.charCodeAt(0));
	const encryptedPassword = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));

	const derivedKey = await deriveKey(masterPassword, salt, argon2);

	const bufferedKey = Buffer.from(derivedKey, 'base64');

	const algorithm = {
		name: 'AES-GCM',
		iv: iv,
		tagLength: 128 // AES-GCM tag length in bits
	};

	const cryptoKey = await crypto.subtle.importKey('raw', bufferedKey, algorithm, false, [
		'decrypt'
	]);

	try {
		const decryptedBuffer = await crypto.subtle.decrypt(
			algorithm,
			cryptoKey,
			new Uint8Array([...encryptedPassword, ...tag]) // Concatenate encryptedPassword and tag
		);

		return new TextDecoder().decode(decryptedBuffer);
	} catch (e) {
		console.error('Decryption failed', e);
		return null;
	}
}
