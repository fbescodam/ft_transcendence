
/**
 * A logging wrapper.
 */
class Logger {
	/**
	 * Send an error message.
	 * @param msg The message.
	 */
	static error = (msg: string) => {
		console.error(`%c${msg}`, 
        `font-size: 18px; border-radius: 4px; padding: 8px;`);
	};

	/**
	 * Send an info message.
	 * @param msg The message.
	 */
	static info = (msg: string) => {
		console.info(`%c${msg}`, 
        `font-size: 18px; border-radius: 4px; padding: 8px;`);
	};

	/**
	 * Send a warning message.
	 * @param msg The message.
	 */
	static warn = (msg: string) => {
		console.warn(`%c${msg}`, 
        `font-size: 18px; border-radius: 4px; padding: 8px;`);
	};
}

export default Logger;
