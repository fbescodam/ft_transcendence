import ioClient from "socket.io-client";
import { onMount } from "svelte";
import { jwtToken } from "./Stores/User";
const ENDPOINT = "http://localhost:3000";

export function authSocket() {
	const socket = ioClient(ENDPOINT)
	return (socket);
}

export function initSocket() {
	const socket = ioClient(ENDPOINT, {
		auth: {
			token: window.localStorage.getItem("jwt")
		}
	})

	return (socket);
};