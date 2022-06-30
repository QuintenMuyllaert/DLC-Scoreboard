export interface User {
	username: string;
	password: string;
	isAdmin: boolean;
	serial: string;
	firstLogin: boolean;
}

export interface Scoreboard {
	isPlaying: boolean;
	hb: string;
	ho: string;
	ub: string;
	uo: string;
	t1: number;
	t2: number;
	message: string;
	timer: string;
	nameHome: string;
	nameOut: string;
	clockData: {
		clockStart: number;
		pauseStart: number;
		pauseStop: number;
		clockOffset: number;
		paused: boolean;
	};
	serial: string;
	hasAdmin: boolean;
	colors: string[];
}

export interface Template {
	serial: string;
	name: string;
	parts: number;
	duration: number;
}

export const defaultTemplate: Template = {
	serial: "N/A",
	name: "N/A",
	parts: 0,
	duration: 0,
};

export const defaultScoreboard: Scoreboard = {
	serial: "N/A",
	isPlaying: false,
	hb: "black",
	ho: "black",
	ub: "black",
	uo: "black",
	t1: 0,
	t2: 0,
	message: "DLC Sportsystems - Made with 💙 by QMA",
	timer: "00:00",
	nameHome: "THUIS",
	nameOut: "UIT",
	clockData: { clockStart: Date.now(), pauseStart: Date.now(), pauseStop: 0, clockOffset: 0, paused: true },
	colors: ["green", "lightblue", "darkblue", "purple", "white", "black", "yellow", "red", "orange", "darkred"],
	hasAdmin: false,
};

export interface LooseObject {
	[key: string]: any;
}
