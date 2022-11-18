import ioClient from "socket.io-client";

const ENDPOINT = "http://localhost:3000";

/**
 * Creates a new ioClient.
 * @returns The new socket.
 */
export function authSocket() {
	return (ioClient(ENDPOINT));
}

/**
 * Creates a new socket using the JWT in local storage.
 * @returns The new IOClient socket.
 */
export function initSocket() {
	return ioClient(ENDPOINT, {
		auth: {
			token: window.localStorage.getItem("jwt")
		}
	});
};
