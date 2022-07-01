import { io } from "socket.io-client";

import { getQuery } from "../utils/Utils";
import Socketstate from "./Socketstate";

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
	setSponsorReel(sponsor: Array<string>) {}
	setFullScreenSponsors(value: boolean) {}
	upload = (element: any) => {};
	uploadProperties = (folder: string, name: string) => {};
	updateColorArray(colorArray: string[]) {}
	startMatch() {}
	setMatchData(matchData: any) {}
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
			console.log(serial);
			this.socket.emit("data", serial); // send serial number to server TODO: get serial number from device

			this.socket.on("data", function (element: string, thing: string, type: string, value: string) {
				//$("#wauw").attr('style',dat[0]+": "+dat[1]); // update data
				console.log(element, thing, type, value);

				if (["#hb", "#ub", "#ho", "#uo"].includes(element)) {
					Socketstate.updateState(element.replace("#", ""), value.replace("fill:", ""));
				}
				if (element == "#timer" && thing == "text") {
					Socketstate.updateState("timer", type);
				}
				if (element == "#t1" && thing == "text") {
					Socketstate.updateState("t1", type);
				}
				if (element == "#t2" && thing == "text") {
					Socketstate.updateState("t2", type);
				}
				if (element == "#message" && thing == "text") {
					Socketstate.updateState("message", type);
				}
			});

			this.socket.on("invokeuri", function (uri: string) {
				//NYI
			});
		}

		this.socket.on("disconnect", () => {
			console.log("disconnected");
			//this.socket.socket.reconnect();
		});

		this.socket.on("state", (data: any) => {
			console.log("state", data);
			Socketstate.mergeState(data);
		});

		this.socket.on("clockData", (data: any) => {
			console.log("clockData", data);
			Socketstate.mergeState({ clockData: data });
		});

		this.socket.on("uploaded", () => {
			console.log("uploaded");
			Socketstate.updateState("fileIsUploaded", true);
		});

		this.socket.on("startmatch", (data: boolean) => {
			console.log("startmatch", data);
			Socketstate.updateState("isPlaying", data);
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
	}
	setTimer(time: number) {
		console.log("setTimer", time);
		this.socket.emit("clockEvent", { type: "set", value: time });
	}
	pauseTimer() {
		console.log("pauseTimer");
		this.socket.emit("clockEvent", { type: "pause" });
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
		Socketstate.updateState("fileIsUploaded", false);
		this.socket.emit("upload", folder, name);
	};
	updateColorArray(colorArray: string[]) {
		console.log("updateColorArray", colorArray);
		this.socket.emit("input", "COLORS", colorArray);
	}
	async startMatch() {
		console.log("startMatch");
		//Screen to scoreboard
		this.socket.emit("startmatch", true);

		const state = Socketstate.getState();
		//scoreboardInterface.setScreen("P0");

		scoreboardInterface.resetScore();
		scoreboardInterface.pauseTimer();
		scoreboardInterface.resetTimer();

		scoreboardInterface.changeColor("1B", state.hb);
		scoreboardInterface.changeColor("1O", state.ho);
		scoreboardInterface.changeColor("2B", state.ub);
		scoreboardInterface.changeColor("2O", state.uo);

		scoreboardInterface.setFullScreenSponsors(false);
		scoreboardInterface.setSponsorReel([]);
	}
	async stopMatch() {
		console.log("stopMatch");
		//Screen to scoreboard
		this.socket.emit("startmatch", false);
		//scoreboardInterface.setFullScreenSponsors(true);
		//scoreboardInterface.setSponsorReel(["QMA"]);
	}
	setMatchData(data: { halfs: number; halfLength: number }) {
		console.log("setMatchData", data);
		const { halfs, halfLength } = data;
		if (!halfs || !halfLength) {
			console.log("Invalid data", data);
			return;
		}
		this.socket.emit("matchtemplate", data);
	}
}

export const scoreboardInterface: InterfaceScoreboard = new InterfaceSocket(document.location.origin);

//@ts-ignore
document.scoreboardInterface = scoreboardInterface;
