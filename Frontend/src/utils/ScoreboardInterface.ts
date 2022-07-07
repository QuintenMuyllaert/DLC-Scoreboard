import { io } from "socket.io-client";
import { AppStateKeys, clockData, FlagPlace, HMP } from "../../../Interfaces/interfaces";

import { getQuery } from "../utils/Utils";
import Appstate from "./Appstate";

const loopback = "http://127.0.0.1:1234";

export class InterfaceScoreboard {
	uri: string;
	constructor(uri: string) {
		this.uri = uri;
	}
	changeColor(team: `${1 | 2}${"B" | "O"}`, color: string) {}
	resetScore() {}
	addScore(team: "G1" | "G2", score: number) {}
	resetTimer() {}
	setTimer(time: number) {}
	pauseTimer() {}
	resumeTimer() {}
	setRealTime(toggle: boolean) {}
	sendMessage(message: string) {}
	getMessage() {}
	setScreen(screen: `P${number}`) {}
	detect = async () => {
		return loopback;
	};
	pauseAt(ms: number) {}
	setSponsorReel(sponsor: Array<string>) {}
	setFullScreenSponsors(value: boolean) {}
	updateColorArray(colorArray: string[]) {}
	startMatch(halfs: number, halfLength: number) {}
	stopMatch() {}
	emit(event: string, ...args: any[]) {}
}

export class InterfaceSocket {
	uri: string;
	socket: any;
	message: string = "";
	uploader: any;
	constructor(uri: string) {
		this.uri = uri;
		this.socket = io(this.uri, {
			transports: ["websocket", "polling"],
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			reconnectionAttempts: 999999,
		});

		//@ts-ignore hack to get socket from console..
		document.socket = this.socket;

		this.socket.on("connect", async () => {
			console.log("Connected to wss");
			this.socket.emit("template", { type: "read" });
		});

		this.socket.on("disconnect", () => {
			console.log("disconnected");
		});

		const pagesHMP = ["/scoreboard", "/livestream", "/spectate"];
		const isHMPPage = pagesHMP.includes(document.location.pathname.toLowerCase());
		const { serial } = getQuery();
		if (isHMPPage && serial && serial.length) {
			const data: HMP = {
				deviceName: serial,
				deviceType: "inanis",
				firmwareVersion: "N/A",
				hostName: "N/A",
				multiScreenId: "N/A",
				serialNumber: serial,
			};
			this.socket.emit("data", data);
		}

		this.socket.on("Appstate", (key: AppStateKeys, value: any) => {
			console.log("Appstate", key, value);
			Appstate.updateState(key, value);
		});
	}
	emit(event: string, ...args: any[]) {
		console.log("emit", event, ...args);
		this.socket.emit(event, ...args);
	}
	changeColor(team: `${1 | 2}${"B" | "O"}`, color: string) {
		console.log("changeColor", team, color);
		this.socket.emit("input", team, color);
	}
	resetScore() {
		console.log("resetScore");
		this.socket.emit("input", "G1", "reset");
		this.socket.emit("input", "G2", "reset");
	}
	addScore(team: "G1" | "G2", score: number) {
		console.log("addScore", team, score);
		this.socket.emit("input", team, score);
	}
	resetTimer() {
		console.log("resetTimer");
		this.socket.emit("clockEvent", { type: "set", value: 0 });
		this.socket.emit("clockEvent", { type: "clearAutoPause" });
	}
	setTimer(time: number) {
		console.log("setTimer", time);
		this.socket.emit("clockEvent", { type: "set", value: time });
	}
	pauseTimer() {
		console.log("pauseTimer");
		this.socket.emit("clockEvent", { type: "pause" });
	}
	pauseAt(ms: number) {
		console.log("pauseAt", ms);
		this.socket.emit("clockEvent", { type: "autoPause", value: ms });
	}
	resumeTimer() {
		console.log("resumeTimer");
		this.socket.emit("clockEvent", { type: "resume" });
	}
	setRealTime(toggle: boolean) {
		console.log("setRealTime", toggle);
		this.socket.emit("clockEvent", { type: "realTime", value: toggle });
	}
	sendMessage(message: string) {
		console.log("sendMessage", message);
		this.message = message;
		this.socket.emit("input", "message", message);
	}
	getMessage() {
		console.log("getMessage");
		//TODO : Get from server
		return this.message;
	}
	setScreen(screen: `P${number}`) {
		console.log("setScreen", screen);
		if (screen == "P0") {
			this.socket.emit("input", "screen", null);
			return;
		}
		this.socket.emit("input", "screen", screen);
	}
	setSponsorReel(sponsor: Array<string>) {
		console.log("setSponsorReel", sponsor);
		this.socket.emit("input", "SPONSORS", sponsor);
	}
	setFullScreenSponsors(value: boolean) {
		console.log("setFullScreenSponsors", value);
		console.log("fullscreen", value);
		this.socket.emit("input", "fullscreen", value);
	}
	detect = async () => {
		console.log("detect");
		return this.uri;
	};
	updateColorArray(colorArray: string[]) {
		console.log("updateColorArray", colorArray);
		this.socket.emit("input", "COLORS", colorArray);
	}
	async startMatch(halfs: number = 0, halfLength: number = 0) {
		console.log("startMatch");
		//Screen to scoreboard
		this.socket.emit("input", "match", true);

		scoreboardInterface.resetScore();
		scoreboardInterface.pauseTimer();
		scoreboardInterface.resetTimer();
		scoreboardInterface.setRealTime(false);

		if (halfs && halfLength) {
			for (let i = 1; i <= halfs; i++) {
				console.log("Pausing at ", halfLength * i * 60);
				scoreboardInterface.pauseAt(halfLength * i * 1000 * 60);
			}
		}

		scoreboardInterface.setFullScreenSponsors(false);
	}
	async stopMatch() {
		console.log("stopMatch");
		this.socket.emit("input", "match", false);
		scoreboardInterface.setRealTime(true);
		scoreboardInterface.setFullScreenSponsors(true);
	}
}

export const scoreboardInterface: InterfaceScoreboard = new InterfaceSocket(document.location.origin);

//@ts-ignore
document.scoreboardInterface = scoreboardInterface;
