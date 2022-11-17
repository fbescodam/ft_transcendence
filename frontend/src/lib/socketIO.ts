import ioClient from "socket.io-client";

const ENDPOINT = "http://localhost:3000";

export function authSocket() {
	return (ioClient(ENDPOINT));
}

export function initSocket() {
	const socket = ioClient(ENDPOINT, {
		auth: {
			token: window.localStorage.getItem("jwt")
		}
	})

	return (socket);
};