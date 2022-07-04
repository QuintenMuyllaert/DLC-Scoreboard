import { io } from "socket.io-client";

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
	sendMessage(message: string) {}
	getMessage() {}
	setScreen(screen: `P${number}`) {}
	detect = async () => {
		return loopback;
	};
	pauseAt(ms: number) {}
	setSponsorReel(sponsor: Array<string>) {}
	setFullScreenSponsors(value: boolean) {}
	upload = (element: any) => {};
	uploadProperties = (folder: string, name: string) => {};
	updateColorArray(colorArray: string[]) {}
	startMatch(halfs: number, halfLength: number) {}
	stopMatch() {}
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
			const { serial } = getQuery();
			if (serial && serial.length) {
				console.log(serial);
				this.socket.emit("data", serial); // send serial number to server TODO: get serial number from device
			}
		});

		//@ts-ignore SIFO...
		this.uploader = new SocketIOFileUpload(this.socket);

		const { serial } = getQuery();
		if (serial && serial.length) {
			//this is only for /scoreboard?serial=xxx
			console.log(serial);
			this.socket.emit("data", serial); // send serial number to server TODO: get serial number from device

			this.socket.on("data", function (element: string, thing: string, type: string, value: string) {
				//$("#wauw").attr('style',dat[0]+": "+dat[1]); // update data
				console.log(element, thing, type, value);

				if (["#hb", "#ub", "#ho", "#uo"].includes(element)) {
					Appstate.updateState(element.replace("#", ""), value.replace("fill:", ""));
				}
				if (element == "#timer" && thing == "text") {
					Appstate.updateState("timer", type);
				}
				if (element == "#t1" && thing == "text") {
					Appstate.updateState("t1", type);
				}
				if (element == "#t2" && thing == "text") {
					Appstate.updateState("t2", type);
				}
				if (element == "#message" && thing == "text") {
					Appstate.updateState("message", type);
				}
			});
		}

		this.socket.on("disconnect", () => {
			console.log("disconnected");
			//this.socket.socket.reconnect();
		});

		this.socket.on("Appstate", (key: string, value: any) => {
			console.log("Appstate", key, value);
			Appstate.updateState(key, value);
		});
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
		console.log("reel", sponsor);
		this.socket.emit("sponsors", sponsor);
	}
	setFullScreenSponsors(value: boolean) {
		console.log("setFullScreenSponsors", value);
		console.log("fullscreen", value);
		this.socket.emit("fullscreen", value);
	}
	detect = async () => {
		console.log("detect");
		return this.uri;
	};
	upload = (element: any) => {
		console.log("upload", element);
		setTimeout(() => {
			this.uploader.listenOnInput(element.current);
		}, 1000);
	};
	uploadProperties = (folder: string, name: string) => {
		console.log("uploadProperties", folder, name);
		Appstate.updateState("fileIsUploaded", false);
		this.socket.emit("upload", folder, name);
	};
	updateColorArray(colorArray: string[]) {
		console.log("updateColorArray", colorArray);
		this.socket.emit("input", "COLORS", colorArray);
	}
	async startMatch(halfs: number = 0, halfLength: number = 0) {
		console.log("startMatch");
		//Screen to scoreboard
		this.socket.emit("input", "match", true);

		const { scoreboard } = Appstate.getState();
		//scoreboardInterface.setScreen("P0");

		scoreboardInterface.resetScore();
		scoreboardInterface.pauseTimer();
		scoreboardInterface.resetTimer();

		if (halfs && halfLength) {
			for (let i = 1; i <= halfs; i++) {
				console.log("Pausing at ", halfLength * i * 60);
				scoreboardInterface.pauseAt(halfLength * i * 1000 * 60);
			}
		}

		scoreboardInterface.changeColor("1B", scoreboard.hb);
		scoreboardInterface.changeColor("1O", scoreboard.ho);
		scoreboardInterface.changeColor("2B", scoreboard.ub);
		scoreboardInterface.changeColor("2O", scoreboard.uo);

		scoreboardInterface.setFullScreenSponsors(false);
		scoreboardInterface.setSponsorReel([]);
	}
	async stopMatch() {
		console.log("stopMatch");
		//Screen to scoreboard
		this.socket.emit("input", "match", false);
		//scoreboardInterface.setFullScreenSponsors(true);
		//scoreboardInterface.setSponsorReel(["QMA"]);
	}
}

export const scoreboardInterface: InterfaceScoreboard = new InterfaceSocket(document.location.origin);

//@ts-ignore
document.scoreboardInterface = scoreboardInterface;
