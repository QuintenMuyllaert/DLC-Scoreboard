import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

import { extractToken, jwtVerifyAsync } from "./crypto";

let managerID: string | null = null;
let queue: any[] = [];

export const attachSocketIO = (server: any) => {
	const io = new Server(server, {
		cors: {
			origin: "*",
		},
		maxHttpBufferSize: 1e8,
	});

	const pubClient = createClient({ url: process.env["REDIS_CONNECTION"] });
	const subClient = pubClient.duplicate();

	Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
		io.adapter(createAdapter(pubClient, subClient));
	});

	io.on("connection", async (socket: any) => {
		console.log(socket.id, "Connection made to websocket");
		socket.on("echo", (...args: any[]) => {
			console.log("echo", ...args);
			socket.emit("echo", ...args);
		});

		socket.on("manager", () => {
			console.log("manager", socket.id);
			managerID = socket.id;

			for (const item of queue) {
				socket.emit("manage", item);
			}
			queue = [];

			socket.on("disconnect", () => {
				managerID = null;
			});
		});

		socket.on("auth", async (token: any) => {
			const { valid, body } = await jwtVerifyAsync(token);
			socket.auth = valid;
			socket.body = body;
			const serial = body?.serial;

			console.log(socket.id, "JWT :", valid, body);
			if (!valid) {
				console.log("Invalid token");
				return;
			}

			if (!serial) {
				console.log("No serial");
				return;
			}

			if (serial.includes("-")) {
				console.log("Invalid serial");
				return;
			}

			socket.join(serial);
			socket.join(`${serial}-USER`);

			const metadata = {
				serial,
				deviceType: null,
				sid: socket.id,
				type: "USER",
			};

			if (!managerID) {
				console.log("No managerID");
				queue.push(metadata);
				return;
			}

			io.to(managerID).emit("newConnection", metadata);
		});

		socket.on("data", async (data: any) => {
			//When display sends serial number over wss.
			console.log(socket.id, "data :", data);
			const serial = data?.serialNumber;
			const deviceType = data?.deviceType;

			if (!serial) {
				console.log("No serial number");
				return;
			}

			if (serial.includes("-")) {
				console.log("Serial contains -");
				return;
			}

			if (!deviceType) {
				console.log("No device type");
				return;
			}

			if (deviceType.includes("-")) {
				console.log("deviceType contains -");
				return;
			}

			socket.join(serial);
			socket.join(`${serial}-DISPLAY`);
			socket.join(`${serial}-${deviceType.toUpperCase()}`);

			const metadata = {
				serial,
				deviceType: deviceType.toUpperCase(),
				sid: socket.id,
				type: "DISPLAY",
			};

			if (!managerID) {
				console.log("No managerID");
				queue.push(metadata);
				return;
			}

			io.to(managerID).emit("newConnection", metadata);
		});
	});
};
