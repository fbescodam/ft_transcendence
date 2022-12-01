import { goto } from "$app/navigation";
import ioClient from "socket.io-client";
import type { Socket } from "socket.io-client";

/**
 * Creates a new ioClient.
 * @returns The new socket.
 */
export function authSocket(hostname: string): Socket {
	console.log(`Initializing auth socket at http://${hostname}:3000`);
	return (ioClient(`http://${hostname}:3000`));
}

/**
 * Creates a new socket using the JWT in local storage.
 * @returns The new IOClient socket.
 */
export function initSocket(hostname: string, JWT: string): Socket {
	console.log(`Initializing socket at http://${hostname}:3000`);

	const io = ioClient(`http://${hostname}:3000`, {
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
