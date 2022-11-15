import ioClient from "socket.io-client";
import { user } from "./Stores/User";
const ENDPOINT = "http://localhost:3000";

const socket = ioClient(ENDPOINT, {
	auth: {
		token: "temp"
	}
})

export const io = socket