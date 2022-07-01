import { clockify } from "./util";
import { Timer } from "./timer";
export const SocketNamespace = class SocketNamespace {
	serial: string;
	users: Array<any> = [];
	displays: Array<any> = [];
	data: any = {};
	time: number = 0;
	timer = new Timer();
	sponsors = [];
	showSponsors = false;

	constructor(serial: string, data: any) {
		console.log("Created namespace", serial);
		this.serial = serial;
		this.data = data;
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
	addDisplay(socket: any) {
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

		this.displays.push(socket);
		socket.on("disconnect", () => {
			this.displays.splice(this.displays.indexOf(socket), 1);
		});
	}
	addUser(socket: any) {
		console.log("Added user to namespace", this.serial);
		socket.emit("state", this.data);
		socket.emit("clockData", this.timer.data);

		//socket.emit("clock", this.timer.data);
		this.users.push(socket);
		socket.on("disconnect", () => {
			this.users.splice(this.users.indexOf(socket), 1);
		});

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
	emitAll(event: string, ...args: any[]) {
		//console.log(`Sending to ${this.displays.length} displays & ${this.users.length} users in ${this.serial}`);
		this.displays.forEach((display) => {
			display.emit(event, ...args);
		});
		this.users.forEach((user) => {
			user.emit(event, ...args);
		});
	}
	emitUsers(event: string, ...args: any[]) {
		//console.log(`Sending to ${this.users.length} users in ${this.serial}`);
		this.users.forEach((user) => {
			user.emit(event, ...args);
		});
	}
	emitDisplays(event: string, ...args: any[]) {
		this.displays.forEach((display) => {
			display.emit(event, ...args);
		});
	}
};
