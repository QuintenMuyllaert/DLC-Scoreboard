import { Server } from "socket.io";
import { extractToken, jwtVerifyAsync } from "./crypto";
import { LooseObject } from "./schema/schema";
import { Namespace } from "./namespace";

export const attachSocketIO = (server: any) => {
	const io = new Server(server);

	const namespace: LooseObject = {};
	const getNamespace = (serial: string) => {
		if (!namespace[serial]) {
			namespace[serial] = new Namespace(serial, io);
		}
		return namespace[serial];
	};

	io.on("connection", async (socket: any) => {
		console.log(socket.id, "Connection made to websocket");

		socket.on("echo", (...args: any[]) => {
			console.log("echo", ...args);
			socket.emit("echo", ...args);
		});

		socket.on("data", async (serial: any) => {
			//When display sends serial number over wss.
			console.log(socket.id, "SERIAL :", serial);
			if (!serial) {
				return;
			}
			socket.serial = serial;
			console.log("Display joined", serial, socket.id);
			const ns = getNamespace(serial);
			ns.addDisplay(socket);
		});

		const token = extractToken(socket);
		const { valid, body } = await jwtVerifyAsync(token);
		socket.auth = valid;
		socket.body = body;
		console.log(socket.id, "JWT :", valid, body);
		if (socket.auth && body.serial) {
			console.log("Client joined", body.serial, socket.id);
			const ns = getNamespace(body.serial);
			ns.addUser(socket);
		}
	});
};
