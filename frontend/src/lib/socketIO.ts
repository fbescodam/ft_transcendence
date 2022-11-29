import { goto } from "$app/navigation";
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
export function initSocket(JWT: string) {
	const io = ioClient(ENDPOINT, {
		auth: {
			token: JWT
		}
	});

	io.on("disconnect", () => {
		JWT = "";
		goto("/auth", { replaceState: false });
	});

	//TODO: connection errors
	io.emit("verifyJWT", function(answer:any) {
		if (answer.status != "ok")
			goto("/auth", { replaceState: false });
	});
	return (io);
};
