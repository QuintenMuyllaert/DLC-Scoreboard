import { Server } from "socket.io";
//@ts-ignore
import siofu from "socketio-file-upload";
import { mkdirSync, renameSync } from "fs";
import database from "./database";
import { SocketNamespace } from "./socketnamespace";
import { extractToken, jwtVerifyAsync } from "./crypto";
import { LooseObject, Scoreboard, defaultScoreboard } from "./schema/schema";
import { delay } from "./util";

// WS(S) server
const namespaces: LooseObject = {};
export const gengetNamespace = async (serial: string, allowGeneration: boolean) => {
	console.log(serial);
	if (!namespaces[serial]) {
		namespaces[serial] = true;

		let reply: any[] = await database.read("scoreboards", { serial });
		if (!reply.length && allowGeneration) {
			const newScoreboard: Scoreboard = { ...defaultScoreboard, serial };
			await database.create("scoreboards", newScoreboard);
			reply = [newScoreboard];
		}

		namespaces[serial] = new SocketNamespace(serial, reply[0]);
	}

	while (namespaces[serial] === true) {
		console.log("waiting to add to ns");
		await delay(100);
	}

	return namespaces[serial];
};

export const attachSocketIO = (server: any) => {
	const io = new Server(server);
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
			const ns = await gengetNamespace(serial, true);
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

			const scoreboardSocket = namespaces[body.serial];
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
			database.update("scoreboards", { serial: scoreboardSocket.serial }, scoreboardSocket.data);
		});

		const token = extractToken(socket);
		const { valid, body } = await jwtVerifyAsync(token);
		socket.auth = valid;
		socket.body = body;
		console.log(socket.id, "JWT :", valid, body);
		if (socket.auth && body.serial) {
			let uploadDetails: any = {
				gotten: false,
				folder: "",
				name: "",
			};

			try {
				console.log("making dir");
				mkdirSync(`www/${body.serial}`);
			} catch (err) {
				console.log("dir exists");
			}

			socket.on("upload", (folder: string, name: string) => {
				if (folder.includes(".")) {
					console.log("NO");
					return;
				}
				let fulln = folder + name;
				if (fulln.includes("/") || fulln.includes("\\") || fulln.includes("..")) {
					console.log("NO");
					return;
				}

				uploadDetails = {
					gotten: true,
					folder: folder,
					name: name,
				};

				try {
					console.log("making dir");
					mkdirSync(`www/${body.serial}/${folder}`);
				} catch (err) {
					console.log("dir exists");
				}
			});

			const ns = await gengetNamespace(body.serial, true);
			ns.addUser(socket);

			const uploader = new siofu();
			uploader.dir = `www/${body.serial}`;
			uploader.on("saved", (data: any) => {
				console.log(data, uploadDetails);
				const { gotten, folder, name } = uploadDetails;
				if (gotten && folder && name) {
					try {
						const from = data.file.pathName;
						const to = `www/${body.serial}/${uploadDetails.folder}/${uploadDetails.name}.${data.file.name.split(".").pop()}`;
						console.log(from, to);
						renameSync(from, to);
					} catch (e) {
						console.log(e);
					}
				}

				socket.emit("uploaded", true);
			});
			uploader.on("error", function (event: any) {
				console.log("Error from uploader", event);
			});
			uploader.listen(socket);
		}
	});
};
