import { clockify } from "./util";
import { Timer } from "./timer";
export const SocketNamespace = class SocketNamespace {
	serial: string;
	users: Array<any> = [];
	displays: Array<any> = [];
	data: any = {};
	time: number = 0;
	clock = new Timer();
	sponsors = [];
	showSponsors = false;

	pauseAt: number = -1;
	halfLength: number = -1;
	halfs: number = -1;
	useTemplateSystem: boolean = false;
	constructor(serial: string, data: any) {
		console.log("Created namespace", serial);
		this.serial = serial;
		this.data = data;
		this.clock.setData(data);
		this.clock.set(0);

		setInterval(() => {
			if (this.useTemplateSystem) {
				if (this.halfs > 0 && this.pauseAt >= 0) {
					const timeP = this.clock.getSecondsPassed();
					if (timeP >= this.pauseAt) {
						console.log("PAUSE!!!!");
						this.clock.pause();
						this.clock.set(this.pauseAt);
						this.halfs--;
						this.pauseAt += this.halfLength;
					}
				} else {
					console.log("no halfs", this.halfs, this.pauseAt);
				}
			}

			if (this.clock.changes) {
				console.log("Clockchanges");
				this.clock.changes = false;
				this.emitAll("clock", this.clock.data);
				this.data.clockData = this.clock.data;
			}
		}, 50);

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
		//socket.emit("data", "#timer", "text", this.data.timer);
		socket.emit("data", "#t1", "text", this.data.t1);
		socket.emit("data", "#t2", "text", this.data.t2);

		socket.emit("clock", this.clock.data);
		socket.emit("sponsor", "");

		this.displays.push(socket);
		socket.on("disconnect", () => {
			this.displays.splice(this.displays.indexOf(socket), 1);
		});
	}
	tick() {
		this.time++;
		this.data.timer = clockify(this.time);
		this.emitUsers("state", { timer: this.data.timer });
		this.emitDisplays("data", "#timer", "text", this.data.timer);
	}
	addUser(socket: any) {
		console.log("Added user to namespace", this.serial);
		socket.emit("state", this.data);
		socket.emit("clock", this.clock.data);
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

		socket.on("clock", (data: any) => {
			if (data.action === "set") {
				this.clock.set(data.value || 0);
			}
			if (data.action === "pause") {
				this.clock.pause();
			}
			if (data.action === "resume") {
				this.clock.resume();
			}
			this.emitAll("clock", this.clock.data);
		});

		socket.on("startmatch", (data: any) => {
			this.data.isPlaying = data ? true : false;
			this.emitUsers("startmatch", this.data.isPlaying);
		});

		socket.emit("startmatch", this.data.isPlaying);

		socket.on("matchtemplate", (data: any) => {
			const { halfs, halfLength } = data;
			this.useTemplateSystem = true;
			console.log("TEMPLATE", data);
			if (halfs && halfLength) {
				console.log("Apply template");
				this.pauseAt = parseInt(halfLength);
				this.halfs = parseInt(halfs);
			} else {
				console.log("Reject template");
			}
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
