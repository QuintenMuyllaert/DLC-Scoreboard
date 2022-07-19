import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
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

	const pubClient = createClient({ url: "redis://localhost:6379" });
	const subClient = pubClient.duplicate();

	Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
		io.adapter(createAdapter(pubClient, subClient));
		//io.listen(3000);
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
		socket.on("auth", async (token: any) => {
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
	});
};
