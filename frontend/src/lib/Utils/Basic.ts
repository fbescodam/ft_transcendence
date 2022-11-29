
/**
 * Creates a random string
 * @param len The length of the string to generate
 * @returns The random string
 */
export function generateRandomString(len: number) {
	const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let result = "";

	for (let i = len; i > 0; --i) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}

	return result;
}

/**
 * Generate a random number between two values
 * @param min The minimum value
 * @param max The maximum value
 * @returns A randm number between min and max
 */
export function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export function formatSeconds(seconds: number) : string {
	let s = Math.floor(seconds % 60);
	let m = Math.floor((seconds / 60) % 60);
	let u = Math.floor(((seconds / 60) / 60 ) % 60);
	if (u == 0) {
		return ((m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s);
	}
	return (u + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s);
}
