import { Timer } from "./timer";
import { Scoreboard, defaultScoreboard } from "./schema/schema";
export const Namespace = class Namespace {
	serial: string;
	io: any;
	data: Scoreboard = defaultScoreboard;
	timer = new Timer();
	sponsors = [];
	showSponsors = false;

	constructor(serial: string, io: any) {
		console.log("Created namespace", serial);
		this.serial = serial;
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
		socket.emit("data", "#hb", "attr", "style", `fill:${this.data.hb}`);
		socket.emit("data", "#ub", "attr", "style", `fill:${this.data.ub}`);
		socket.emit("data", "#ho", "attr", "style", `fill:${this.data.ho}`);
		socket.emit("data", "#uo", "attr", "style", `fill:${this.data.uo}`);
		socket.emit("data", "#message", "text", this.data.message);
		socket.emit("data", "#t1", "text", this.data.t1);
		socket.emit("data", "#t2", "text", this.data.t2);

		socket.emit("clockData", this.timer.data);
		socket.emit("sponsor", "");
	}
	addUser(socket: any) {
		socket.join([`CLIENT-${this.serial}`, this.serial]);

		console.log("Added user to namespace", this.serial);
		socket.emit("state", this.data);
		socket.emit("clockData", this.timer.data);

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
			this.data.isPlaying = data ? true : false;
			this.emitUsers("startmatch", this.data.isPlaying);
		});

		socket.emit("startmatch", this.data.isPlaying);

		console.log("########################\nlisten to clockevent!!");
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

			this.emitAll("clockData", this.timer.data);
		});
	}
};
