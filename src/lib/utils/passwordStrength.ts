export function checkPasswordStrength(password: string) {
	let strength = 0;

	// Check length
	if (password.length >= 8) strength++;
	if (password.length >= 12) strength++;

	// Check for lowercase, uppercase, numbers, and special characters
	if (/[a-z]/.test(password)) strength++;
	if (/[A-Z]/.test(password)) strength++;
	if (/\d/.test(password)) strength++;
	if (/[\W_]/.test(password)) strength++;

	return strength;
}
