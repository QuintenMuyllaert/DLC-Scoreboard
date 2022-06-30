import { io } from "socket.io-client";

import { getQuery } from "../utils/Utils";
import Appstate from "./Appstate";

const loopback = "http://127.0.0.1:1234";

export class InterfaceScoreboard {
	uri: string;
	constructor(uri: string) {
		this.uri = uri;
	}
	// TODO : Implement
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
	async startMatch() {}
	setMatchData(matchData: any) {}
	async stopMatch() {}
}

export class InterfaceSocket {
	uri: string;
	socket: any;
	message: string = "";
	uploader: any;
	constructor(uri: string) {
		this.uri = uri;
		this.socket = io(this.uri, {
			transports: ["websocket"],
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
					Appstate.updateGlobalState(element.replace("#", ""), value.replace("fill:", ""));
				}
				if (element == "#timer" && thing == "text") {
					Appstate.updateGlobalState("timer", type);
				}
				if (element == "#t1" && thing == "text") {
					Appstate.updateGlobalState("t1", type);
				}
				if (element == "#t2" && thing == "text") {
					Appstate.updateGlobalState("t2", type);
				}
				if (element == "#message" && thing == "text") {
					Appstate.updateGlobalState("message", type);
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
			Appstate.mergeGlobalState(data);
		});

		this.socket.on("clock", (data: any) => {
			Appstate.mergeGlobalState({ clockData: data });
		});

		this.socket.on("uploaded", () => {
			Appstate.updateGlobalState("fileIsUploaded", true);
		});

		this.socket.on("startmatch", (data: boolean) => {
			Appstate.updateGlobalState("isPlaying", data);
		});
	}
	changeColor(team: `${1 | 2}${"B" | "O"}`, color: string) {
		this.socket.emit("input", team, color);
	}
	resetScore() {
		this.socket.emit("input", "G1", "reset");
		this.socket.emit("input", "G2", "reset");
	}
	addScore(team: "G1" | "G2", score: number) {
		this.socket.emit("input", team, score);
	}
	resetTimer() {
		this.socket.emit("clock", { action: "set", value: 0 });
	}
	setTimer(time: number) {
		this.socket.emit("clock", { action: "set", value: time });
	}
	pauseTimer() {
		this.socket.emit("clock", { action: "pause" });
	}
	resumeTimer() {
		this.socket.emit("clock", { action: "resume" });
	}
	sendMessage(message: string) {
		this.message = message;
		this.socket.emit("input", "message", message);
	}
	getMessage() {
		//TODO : Get from server
		return this.message;
	}
	setScreen(screen: `P${number}`) {
		if (screen == "P0") {
			this.socket.emit("input", "screen", null);
			return;
		}
		this.socket.emit("input", "screen", screen);
	}
	setSponsorReel(sponsor: Array<string>) {
		console.log("reel", sponsor);
		this.socket.emit("sponsors", sponsor);
	}
	setFullScreenSponsors(value: boolean) {
		console.log("fullscreen", value);
		this.socket.emit("fullscreen", value);
	}
	detect = async () => {
		return this.uri;
	};
	upload = (element: any) => {
		setTimeout(() => {
			this.uploader.listenOnInput(element.current);
		}, 1000);
	};
	uploadProperties = (folder: string, name: string) => {
		Appstate.updateGlobalState("fileIsUploaded", false);
		this.socket.emit("upload", folder, name);
	};
	updateColorArray(colorArray: string[]) {
		this.socket.emit("input", "COLORS", colorArray);
	}
	async startMatch() {
		//Screen to scoreboard
		this.socket.emit("startmatch", true);

		const state = Appstate.getGlobalState();
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
		//Screen to scoreboard
		this.socket.emit("startmatch", false);
		scoreboardInterface.setFullScreenSponsors(true);
		scoreboardInterface.setSponsorReel(["QMA"]);
	}
	setMatchData(data: { halfs: number; halfLength: number }) {
		console.log("match data", data);

		const { halfs, halfLength } = data;
		if (!halfs || !halfLength) {
			console.log("Invalid data", data);
			return;
		}
		this.socket.emit("matchtemplate", data);
	}
}

export const scoreboardInterface: InterfaceScoreboard = new InterfaceSocket(document.location.origin);
