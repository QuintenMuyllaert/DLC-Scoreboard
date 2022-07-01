import database from "./database";
import { Timer } from "./timer";
import { Scoreboard, defaultScoreboard } from "./schema/schema";
export const Namespace = class Namespace {
	serial: string;
	io: any;
	scoreboard: Scoreboard = defaultScoreboard;
	timer = new Timer();
	sponsors = [];
	showSponsors = false;

	constructor(serial: string, io: any) {
		console.log("Created namespace", serial);
		this.serial = serial;
		this.scoreboard.serial = serial;
		this.io = io;
		this.timer.pause();
		this.timer.set(0);
		this.timer.emit = (event: string, data: any) => {
			this.emitAll(event, data);
		};

		setInterval(() => {
			this.attemptShowsponsors();
			this.spIndex++;
		}, 5000);

		(async () => {
			const exists = await database.exists("scoreboards", { serial });
			if (exists) {
				console.log("Existing scoreboard found", serial);
				const [scoreboardRecord] = await database.read("scoreboards", { serial });

				//@ts-ignore
				this.scoreboard = scoreboardRecord;
			} else {
				console.log("Scoreboard not found, creating new scoreboard", serial);
				await database.create("scoreboards", { ...this.scoreboard, serial });
			}

			this.timer.data = this.scoreboard.clockData;
			this.emitUsers("Appstate", "scoreboard", this.scoreboard);
			this.emitUsers("Appstate", "clockData", this.timer.data);
			this.emitDisplays("clockData", this.timer.data);
		})();
	}
	spIndex = 0;
	attemptShowsponsors() {
		if (this.showSponsors) {
			const sp = this.sponsors[this.spIndex % this.sponsors.length];
			this.emitDisplays("sponsor", sp);
		}
	}
	emitDisplays = (event: string, ...args: any[]) => {
		console.log("emitDisplays", event, args);
		this.io.in(`DISPLAY-${this.serial}`).emit(event, ...args);
	};
	emitUsers = (event: string, ...args: any[]) => {
		console.log("emitUsers", event, args);
		this.io.in(`CLIENT-${this.serial}`).emit(event, ...args);
	};
	emitAll = (event: string, ...args: any[]) => {
		console.log("emitAll", event, args);
		this.io.in(this.serial).emit(event, ...args);
	};
	addDisplay(socket: any) {
		socket.join([`DISPLAY-${this.serial}`, this.serial]);

		console.log("Added display to namespace", this.serial);
		socket.emit("data", "#hb", "attr", "style", `fill:${this.scoreboard.hb}`);
		socket.emit("data", "#ub", "attr", "style", `fill:${this.scoreboard.ub}`);
		socket.emit("data", "#ho", "attr", "style", `fill:${this.scoreboard.ho}`);
		socket.emit("data", "#uo", "attr", "style", `fill:${this.scoreboard.uo}`);
		socket.emit("data", "#message", "text", this.scoreboard.message);
		socket.emit("data", "#t1", "text", this.scoreboard.t1);
		socket.emit("data", "#t2", "text", this.scoreboard.t2);

		socket.emit("clockData", this.timer.data);
		socket.emit("sponsor", "");
	}
	addUser(socket: any) {
		socket.join([`CLIENT-${this.serial}`, this.serial]);

		console.log("Added user to namespace", this.serial);
		socket.emit("Appstate", "scoreboard", this.scoreboard);
		socket.emit("Appstate", "clockData", this.timer.data);

		socket.on("sponsors", (data: Array<string>) => {
			if (data && data.length) {
				if (Array.isArray(data)) {
					//@ts-ignore
					this.sponsors = data;
				}
				this.showSponsors = true;
				this.attemptShowsponsors();
			} else {
				this.showSponsors = false;
				this.emitDisplays("sponsor", "");
			}
		});

		socket.on("fullscreen", (value: boolean) => {
			this.emitDisplays("fullscreen", value ? true : false);
		});

		socket.on("startmatch", (data: any) => {
			this.scoreboard.isPlaying = data ? true : false;
			this.emitUsers("startmatch", this.scoreboard.isPlaying);
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
				case "realTime":
					this.timer.realTime = data.value;
					break;
				default:
					console.error("Unknown type", data.type);
			}

			this.scoreboard.clockData = this.timer.data;
			this.emitAll("clockData", this.timer.data);
			database.update("scoreboards", { serial: this.serial }, this.scoreboard);
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
				case "1B": {
					this.scoreboard.hb = value;
					this.emitDisplays("data", "#hb", "attr", "style", `fill:${value}`);
					break;
				}
				case "2B": {
					this.scoreboard.ub = value;
					this.emitDisplays("data", "#ub", "attr", "style", `fill:${value}`);
					break;
				}
				case "1O": {
					this.scoreboard.ho = value;
					this.emitDisplays("data", "#ho", "attr", "style", `fill:${value}`);
					break;
				}
				case "2O": {
					this.scoreboard.uo = value;
					this.emitDisplays("data", "#uo", "attr", "style", `fill:${value}`);
					break;
				}
				case "screen": {
					this.emitDisplays("sponsor", value);
					break;
				}
				case "message": {
					this.scoreboard.message = value;
					this.emitDisplays("data", "#message", "text", value);
					break;
				}
				case "G1": {
					if (value === "reset") {
						this.scoreboard.t1 = 0;
					} else {
						this.scoreboard.t1 += value;
					}
					this.emitDisplays("data", "#t1", "text", this.scoreboard.t1);
					break;
				}
				case "G2": {
					if (value === "reset") {
						this.scoreboard.t2 = 0;
					} else {
						this.scoreboard.t2 += value;
					}
					this.emitDisplays("data", "#t2", "text", this.scoreboard.t2);
					break;
				}
				case "COLORS": {
					this.scoreboard.colors = value;
				}
				default: {
					console.log("No type");
					break;
				}
			}

			this.emitUsers("Appstate", "scoreboard", this.scoreboard);
			database.update("scoreboards", { serial: this.serial }, this.scoreboard);
		});
	}
};
