import { Server } from "socket.io";
import database from "./database";
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

		socket.on("input", (type: any, value: any) => {
			//When user sends input
			console.log("Input received", type, value);
			if (type === undefined || value === undefined) {
				console.log("No type or value");
				return;
			}

			if (!socket.auth) {
				console.log("No auth");
				return;
			}

			if (!socket.body) {
				console.log("No body");
				return;
			}

			const scoreboardSocket = getNamespace(body.serial);
			if (!scoreboardSocket) {
				console.log("No scoreboard");
				return;
			}

			console.log(type, value);
			switch (type) {
				case "1B": {
					scoreboardSocket.data.hb = value;
					scoreboardSocket.emitDisplays("data", "#hb", "attr", "style", `fill:${value}`);
					break;
				}
				case "2B": {
					scoreboardSocket.data.ub = value;
					scoreboardSocket.emitDisplays("data", "#ub", "attr", "style", `fill:${value}`);
					break;
				}
				case "1O": {
					scoreboardSocket.data.ho = value;
					scoreboardSocket.emitDisplays("data", "#ho", "attr", "style", `fill:${value}`);
					break;
				}
				case "2O": {
					scoreboardSocket.data.uo = value;
					scoreboardSocket.emitDisplays("data", "#uo", "attr", "style", `fill:${value}`);
					break;
				}
				case "screen": {
					scoreboardSocket.emitDisplays("sponsor", value);
					break;
				}
				case "message": {
					scoreboardSocket.data.message = value;
					scoreboardSocket.emitDisplays("data", "#message", "text", value);
					break;
				}
				case "timer": {
					scoreboardSocket.data.timer = value;
					scoreboardSocket.emitDisplays("data", "#timer", "text", value);
					break;
				}
				case "G1": {
					if (value === "reset") {
						scoreboardSocket.data.t1 = 0;
					} else {
						scoreboardSocket.data.t1 += value;
					}
					scoreboardSocket.emitDisplays("data", "#t1", "text", scoreboardSocket.data.t1);
					break;
				}
				case "G2": {
					if (value === "reset") {
						scoreboardSocket.data.t2 = 0;
					} else {
						scoreboardSocket.data.t2 += value;
					}
					scoreboardSocket.emitDisplays("data", "#t2", "text", scoreboardSocket.data.t2);
					break;
				}
				case "COLORS": {
					scoreboardSocket.data.colors = value;
				}
				default: {
					console.log("No type");
					break;
				}
			}
			scoreboardSocket.emitUsers("state", scoreboardSocket.data);
			scoreboardSocket.emitUsers("scoreboard", scoreboardSocket.data);
			database.update("scoreboards", { serial: scoreboardSocket.serial }, scoreboardSocket.data);
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
