
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
        `color: white; font-size: 14px; border-radius: 4px; padding: 8px; margin: 8px; background-color: #282c34`);
	};

	/**
	 * Send an info message.
	 * @param msg The message.
	 */
	static info = (msg: string) => {
		console.info(`%c${msg}`, 
        `color: white; font-size: 14px; border-radius: 4px; padding: 8px; margin: 8px; background-color: #282c34`);
	};

	/**
	 * Send a warning message.
	 * @param msg The message.
	 */
	static warn = (msg: string) => {
		console.warn(`%c${msg}`, 
        `color: white; font-size: 14px; border-radius: 4px; padding: 8px; margin: 8px; background-color: #282c34`);
	};
}

export default Logger;
