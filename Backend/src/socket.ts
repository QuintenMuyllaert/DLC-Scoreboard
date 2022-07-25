import { Server } from "socket.io";
import { extractToken, jwtVerifyAsync } from "./crypto";
import { LooseObject } from "../../Interfaces/Interfaces";
import { Namespace } from "./namespace";
import database from "./database";

export const attachSocketIO = (server: any) => {
	const io = new Server(server, {
		cors: {
			origin: "*",
		},
		maxHttpBufferSize: 1e8,
	});

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

		socket.on("data", async (data: any) => {
			//When display sends serial number over wss.
			console.log(socket.id, "data :", data);
			const serial = data?.serialNumber;
			if (!serial) {
				return;
			}

			let [hmp] = (await database.exists("HMP", { serialNumber: serial }))
				? await database.read("HMP", { serialNumber: serial })
				: await database.create("HMP", data);

			// 🤔 Need to figure out how to handle this properly.
			// A HMP400+ makes 2 socket connections.
			// 1 from the SVG layer (fukiran) and 1 from the HTML layer (inanis).
			hmp.deviceType = data.deviceType;

			socket.serial = serial;
			const ns = getNamespace(serial);
			ns.addDisplay(socket, hmp);
			console.log("Display joined", serial, socket.id);
		});

		socket.on("join", async (serial: string) => {
			const token = extractToken(socket);
			const { valid, body } = await jwtVerifyAsync(token);
			socket.auth = valid;
			socket.body = body;
			console.log(socket.id, "JWT :", valid, body);
			if (!socket.auth || !body.uuid) {
				console.log("Invalid JWT");
				return;
			}

			const permissions = await database.read("permissions", { "users.uuid": body.uuid });
			for (const permission of permissions) {
				if (permission.serial == serial) {
					socket.permission = permission;
					break;
				}
			}

			if (!socket.permission) {
				console.log("No permission for this serial");
				return;
			}

			console.log("Client joined", serial, socket.id);
			const ns = getNamespace(serial);
			ns.addUser(socket);
		});
	});
};
