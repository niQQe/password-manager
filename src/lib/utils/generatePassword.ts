export function generatePassword(length = 16) {
	const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
	const numbers = '0123456789';

	// Special characters that are almost always allowed
	const specialChars = '!@#$%^&*()-_+=[]{}|~';

	// Combine all character sets
	const allChars = upperCase + lowerCase + numbers + specialChars;

	// Make sure the password has at least one of each character type
	const getRandom = (str: string) => str[Math.floor(Math.random() * str.length)];
	let password = [
		getRandom(upperCase),
		getRandom(lowerCase),
		getRandom(numbers),
		getRandom(specialChars)
	];

	// Fill the rest of the password with random characters
	for (let i = 4; i < length; i++) {
		password.push(getRandom(allChars));
	}

	// Shuffle the password array to avoid predictable patterns
	password = password.sort(() => Math.random() - 0.5);

	// Return the password as a string
	return password.join('');
}
