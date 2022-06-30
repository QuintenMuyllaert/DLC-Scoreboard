import { LooseObject } from "./Interfaces";

export let globalState: any;
export let globalSetState: any;

let time = {};

export const defaultState: LooseObject = {
	color: localStorage.getItem("theme") || "dark",
	nameHome: "THUIS",
	nameOut: "UIT",
	t1: 0,
	t2: 0,
	hb: "black",
	ho: "black",
	ub: "black",
	uo: "black",
	timer: "00:00",
	getClock: () => {
		const that = globalState.clockData;
		const now = Date.now();
		const ms = that.paused ? that.pauseStart - that.clockStart - that.clockOffset : now - that.clockStart - that.clockOffset;
		const seconds = Math.max(0, Math.floor(ms / 1000));
		const minutes = Math.max(0, Math.floor(seconds / 60));

		const to2digits = (num: number) => {
			return num < 10 ? `0${num}` : num;
		};

		return `${to2digits(minutes)}:${to2digits(seconds % 60)}`;
	},
	message: "",
	screen: "P0",
	serial: "N/A",
	first: true,
	messagePopup: false,
	clockPopup: false,
	teamColorTeam1Popup: false,
	teamColorTeam2Popup: false,
	colors: [],
	scorbordSponsorsToggle: "left",
	sponsors: [],
	templates: [],
	users: [],
	selectedTemplate: "",
	clockData: {
		clockStart: Date.now(),
		pauseStart: Date.now(),
		pauseStop: 0,
		clockOffset: 0,
		paused: true,
		clock: "00:00",
	},
	isRemove: false,
	deleteTemplatePopup: false,
	templateToDelete: "",
	fileIsUploaded: false,
	deleteSponsorPopup: false,
	sponsorToDelete: {
		bundel: "",
		sponsor: "",
	},
	deleteSponsorbundelPopup: false,
	sponsorbundelToDelete: "",
};

export const attachUseState = (state: any, setState: any) => {
	globalState = state;
	globalSetState = setState;
};

export let refetch = false;
export let setRefetch = (a: boolean) => {
	console.log("setRefetch", a);
};

export const attachRefetch = (state: any, setState: any) => {
	refetch = state;
	setRefetch = (a: boolean) => {
		console.log("refetch");
		setState(a);
	};
};

export const setGlobalState = (val: any) => {
	// console.log("setGlobalState", val);
	globalSetState(val);
};

export const getGlobalState = () => {
	// console.log("getGlobalState", globalState);
	return globalState;
};

export const updateGlobalState = (key: string, value: any) => {
	if (globalState[key] === value) {
		//is same
		return;
	}
	globalState[key] = value;
	setGlobalState({ ...globalState }); // React voodoo magic
	//console.log(key, value);
};

export const mergeGlobalState = (state: any) => {
	const newState = { ...globalState, ...state };
	if (JSON.stringify(globalState) === JSON.stringify(newState)) {
		//is same
		return;
	}
	globalState = newState;
	setGlobalState({ ...globalState }); // React voodoo magic
};

export default {
	attachUseState,
	setGlobalState,
	getGlobalState,
	updateGlobalState,
	mergeGlobalState,
	defaultState,
	attachRefetch,
	setRefetch,
	refetch,
};
