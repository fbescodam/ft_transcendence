
/**
 * 
 * @param len 
 * @returns 
 */
export function generateRandomString(len: number) {
	const chars: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let result: string = "";
	for (let i = len; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	return result;
}
