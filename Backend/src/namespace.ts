import QRCode from "qrcode";

import database from "./database";
import { Timer } from "./timer";
import { Scoreboard, defaultScoreboard, LooseObject, HMP } from "../../Interfaces/Interfaces";

import { outputFile } from "./modules/image-data-uri.js";

import { createWriteStream, existsSync, mkdirSync, readdirSync, rmdirSync, statSync, unlinkSync, writeFileSync } from "fs";
import path from "path";

import { Generate } from "./generate";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Namespace = class Namespace {
	serial: string;
	io: any;
	scoreboard: Scoreboard = defaultScoreboard;
	timer = new Timer();
	gotScoreboardFromDB = false;
	constructor(serial: string, io: any) {
		console.log("Created namespace", serial);
		this.serial = serial;
		this.scoreboard.serial = serial;
		this.io = io;
		this.timer.pause();
		this.timer.set(0);
		this.timer.triggerUpdate = () => {
			this.scoreboard.clockData = this.timer.data;
			this.updateScoreboard(this.scoreboard);
			this.emitDisplays("clockData", this.timer.data);
		};

		existsSync(`./www/${this.serial}`) || mkdirSync(`./www/${this.serial}`);

		(async () => {
			const exists = await database.exists("scoreboards", { serial });
			if (exists) {
				console.log("Existing scoreboard found", serial);
				const [scoreboardRecord] = await database.read("scoreboards", { serial });

				//@ts-ignore
				this.scoreboard = { ...this.scoreboard, ...scoreboardRecord };
			} else {
				console.log("Scoreboard not found, creating new scoreboard", serial);

				const uri = await QRCode.toDataURL(`https://dlcscoreboard.computernetwork.be/qrlink?serial=${serial}`);
				await outputFile(uri, `./www/${serial}/qr.png`);
				this.scoreboard.sponsors = [`https://dlcscoreboard.computernetwork.be/data/${serial}/qr.png`];
				this.scoreboard.message += serial;
				await database.create("scoreboards", { ...this.scoreboard, serial });
			}

			this.timer.data = this.scoreboard.clockData;
			//this.emitUsers("Appstate", "scoreboard", this.scoreboard);
			//this.emitDisplays("clockData", this.timer.data);
			this.gotScoreboardFromDB = true;
		})();

		setInterval(() => {
			if (this.scoreboard.isPlaying) {
				return;
			}

			const getMinutes = (date: Date): number => {
				const hours = date.getHours();
				const minutes = date.getMinutes();
				return hours * 60 + minutes;
			};

			const now = new Date(Date.now());
			const nowMinutes = getMinutes(now);

			if (this.scoreboard.scheduleData.startTime <= nowMinutes && nowMinutes < this.scoreboard.scheduleData.endTime) {
				console.log("Showing reel");
				this.scoreboard.display = true;
				this.scoreboard.sponsors = this.scoreboard.scheduleData.sponsors;
				this.scoreboard.fullscreen = true;
				this.updateScoreboard(this.scoreboard);
			} else {
				console.log("Turning off");
				this.scoreboard.display = false;
				this.updateScoreboard(this.scoreboard);
			}
		}, 1000);
	}
	emitDisplays = (event: string, ...args: any[]) => {
		console.log("emitDisplays", event /*, args*/);
		this.io.in(`DISPLAY-${this.serial}`).emit(event, ...args);
	};
	emitUsers = (event: string, ...args: any[]) => {
		console.log("emitUsers", event /*, args*/);
		this.io.in(`CLIENT-${this.serial}`).emit(event, ...args);
	};
	emitAll = (event: string, ...args: any[]) => {
		console.log("emitAll", event /*, args*/);
		this.io.in(this.serial).emit(event, ...args);
	};
	async addDisplay(socket: any, hmp: HMP) {
		socket.join([`DISPLAY-${this.serial}`, this.serial]);
		while (!this.gotScoreboardFromDB) {
			console.log("Waiting for scoreboard from DB");
			await delay(100);
		}

		socket.emit("eval", Generate(hmp, socket.id));

		console.log("Added display to namespace", this.serial);

		console.log("Sending scoreboard to display", hmp.deviceType);

		const noHTMLSupport = ["bonsai", "sakura", "ikebana"];
		if (noHTMLSupport.includes(hmp.deviceType.toLowerCase())) {
			socket.join(`SVG-${this.serial}`);
			this.sendLegacyScoreboard();
			socket.on("DOMContentLoaded", () => {
				this.sendLegacyScoreboard();
			});
			return;
		}

		if (hmp.deviceType == "inanis") {
			socket.join(`INANIS-${this.serial}`);
			socket.emit("Appstate", "scoreboard", this.scoreboard);
			socket.on("eval", (data: any) => {
				this.io.in(`HTML-${this.serial}`).emit("eval", `(function(){${data};})();`);
			});
			return;
		}

		// "windows" & "fukiran" do not need any aditional data
		// since they summon an inanis instance
		if (hmp.deviceType == "windows" || hmp.deviceType == "fukiran") {
			socket.join(`HTML-${this.serial}`);
			return;
		}
	}
	async addUser(socket: any) {
		socket.join([`CLIENT-${this.serial}`, this.serial]);
		while (!this.gotScoreboardFromDB) {
			console.log("Waiting for scoreboard from DB");
			await delay(100);
		}

		console.log("Added user to namespace", this.serial);

		//TODO : Do this cleaner..
		await this.refetchScoreboard();

		socket.emit("Appstate", "scoreboard", this.scoreboard);
		socket.emit("Appstate", "jwt", socket.body);
		socket.emit("Appstate", "sponsors", this.readSponsorTree());

		(async () => {
			const templates = await database.read("templates", { serial: this.serial });
			socket.emit("Appstate", "templates", templates);
		})();

		socket.on("eval", (data: string) => {
			console.log("eval", data);
			this.emitDisplays("eval", data);
		});

		socket.on("template", async (data: any) => {
			console.log("template", data);
			if (data && data.value && typeof data.value === "object" && !Array.isArray(data.value) && data.value !== null) {
				data.value.serial = this.serial;
			} else {
				return;
			}

			let _id;
			if (data.value._id) {
				_id = new database.ObjectId(data.value._id);
				delete data.value._id;
			}

			switch (data.type) {
				case "create":
					await database.create("templates", data.value);
					break;
				case "read":
					//REDUNDANT
					break;
				case "update":
					await database.update("templates", { serial: this.serial, _id }, data.value);
					break;
				case "delete":
					await database.delete("templates", { serial: this.serial, _id });
			}
			const templates = await database.read("templates", { serial: this.serial });
			this.emitUsers("Appstate", "templates", templates);
		});

		socket.on("sponsors", async (data: any) => {
			console.log("sponsors", data);
			if (data && data.value && typeof data.value === "object" && !Array.isArray(data.value) && data.value !== null) {
				data.value.serial = this.serial;
			} else {
				return;
			}

			let _id;
			if (data.value._id) {
				_id = new database.ObjectId(data.value._id);
				delete data.value._id;
			}

			const folder = data?.value?.folder || "";
			const file = data?.value?.file || "";
			const uri = data?.value?.uri || "";
			const type = data?.value?.type || "";
			if (folder.includes("/") || folder.includes("\\") || folder.includes(".")) {
				return;
			}
			if (file.includes("/") || file.includes("\\")) {
				return;
			}

			switch (data.type) {
				case "create":
					if (!folder) {
						break;
					}

					existsSync(`./www/${this.serial}/${folder}`) || mkdirSync(`./www/${this.serial}/${folder}`);

					if (type == "link") {
						writeFileSync(`./www/${this.serial}/${folder}/${file}`, JSON.stringify({ uri }, null, 2));
					} else if (file) {
						outputFile(uri, `./www/${this.serial}/${folder}/${file}`);
					}

					break;
				case "delete":
					if (folder && !file) {
						rmdirSync(`www/${this.serial}/${folder}`, { recursive: true });
					}
					if (folder && file) {
						unlinkSync(`www/${this.serial}/${folder}/${file}`);
					}
					break;
			}

			this.emitUsers("Appstate", "sponsors", this.readSponsorTree());
		});

		socket.on("clockEvent", (data: any) => {
			console.log("clockEvent", data);

			switch (data.type) {
				case "set":
					this.timer.set(data.value);
					break;
				case "pause":
					this.timer.pause();
					break;
				case "resume":
					this.timer.resume();
					break;
				case "autoPause":
					this.timer.autoPause(data.value);
					break;
				case "clearAutoPause":
					this.timer.clearAutoPause();
					break;
				case "realTime":
					this.timer.realTime = data.value;
					break;
				default:
					console.error("Unknown type", data.type);
			}

			this.scoreboard.clockData = this.timer.data;
			this.emitDisplays("clockData", this.timer.data);
			this.updateScoreboard(this.scoreboard);
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

			console.log(type, value);
			switch (type) {
				case "match": {
					this.scoreboard.isPlaying = value;
					break;
				}
				case "1B": {
					this.scoreboard.hb = value;
					break;
				}
				case "2B": {
					this.scoreboard.ub = value;
					break;
				}
				case "1O": {
					this.scoreboard.ho = value;
					break;
				}
				case "2O": {
					this.scoreboard.uo = value;
					break;
				}
				case "message": {
					this.scoreboard.message = value;
					break;
				}
				case "G1": {
					if (value === "reset") {
						this.scoreboard.t1 = 0;
					} else {
						this.scoreboard.t1 += value;
					}
					break;
				}
				case "G2": {
					if (value === "reset") {
						this.scoreboard.t2 = 0;
					} else {
						this.scoreboard.t2 += value;
					}
					break;
				}
				case "fullscreen": {
					this.scoreboard.fullscreen = value ? true : false;
					break;
				}
				case "enableDisplay": {
					this.scoreboard.display = value ? true : false;
					break;
				}
				case "COLORS": {
					this.scoreboard.colors = value;
					break;
				}
				case "SPONSORS": {
					this.scoreboard.sponsors = value;
					break;
				}
				case "schedule": {
					this.scoreboard.scheduleData = value;
					break;
				}
				default: {
					console.log("No type");
					break;
				}
			}

			this.updateScoreboard(this.scoreboard);
		});
	}
	updateScoreboard(scoreboard: Scoreboard) {
		this.scoreboard = scoreboard;
		this.emitUsers("Appstate", "scoreboard", this.scoreboard);
		this.sendLegacyScoreboard();
		this.io.in(`INANIS-${this.serial}`).emit("Appstate", "scoreboard", this.scoreboard);
		database.update("scoreboards", { serial: this.serial }, this.scoreboard);
	}
	sendLegacyScoreboard() {
		const socket = this.io.in(`SVG-${this.serial}`);
		socket.emit("data", "#hb", "attr", "style", `fill:${this.scoreboard.hb}`);
		socket.emit("data", "#ub", "attr", "style", `fill:${this.scoreboard.ub}`);
		socket.emit("data", "#ho", "attr", "style", `fill:${this.scoreboard.ho}`);
		socket.emit("data", "#uo", "attr", "style", `fill:${this.scoreboard.uo}`);
		socket.emit("data", "#message", "text", this.scoreboard.message);
		socket.emit("data", "#t1", "text", this.scoreboard.t1);
		socket.emit("data", "#t2", "text", this.scoreboard.t2);

		socket.emit("clockData", this.timer.data);
		socket.emit("sponsors", this.scoreboard.sponsors);
		socket.emit("fullscreen", this.scoreboard.fullscreen);
		socket.emit("display", this.scoreboard.display);
	}
	readSponsorTree() {
		const tree = [];
		const folder = `www/${this.serial}/`;
		const files = readdirSync(folder);
		for (const file of files) {
			const stat = statSync(`${folder}/${file}`);
			if (!stat.isFile()) {
				tree.push({
					name: file,
					children: readdirSync(path.join(folder, file)),
				});
			}
		}
		return tree;
	}
	async refetchScoreboard() {
		const exists = await database.exists("scoreboards", { serial: this.serial });
		if (exists) {
			console.log("Existing scoreboard found", this.serial);
			const [scoreboardRecord] = await database.read("scoreboards", { serial: this.serial });

			//@ts-ignore
			this.scoreboard = { ...this.scoreboard, ...scoreboardRecord };
		} else {
			console.log("No scoreboard found, this should not be possible");
		}

		this.updateScoreboard(this.scoreboard);
	}
};
