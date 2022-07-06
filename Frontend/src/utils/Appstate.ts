import { LooseObject } from "../../../Interfaces/interfaces";

export let state: any;
export let setState: any;

export const defaultState: LooseObject = {
	color: "dark",
	bottomtab: "",
	scoreboard: {
		serial: "N/A",
		isPlaying: false,
		fullscreen: false,
		sponsors: [],
		hb: "black",
		ho: "black",
		ub: "black",
		uo: "black",
		t1: 0,
		t2: 0,
		message: "DLC Sportsystems - Made with 💙 by QMA",
		nameHome: "THUIS",
		nameOut: "UIT",
		clockData: { realTime: true, paused: true, startTime: Date.now(), startPauseTime: Date.now(), pauseTime: 0 },
		colors: ["green", "lightblue", "darkblue", "purple", "white", "black", "yellow", "red", "orange", "darkred"],
		hasAdmin: false,
	},
	templates: [],
	sponsors: [],
};

export const attachUseState = (_state: any, _setState: any) => {
	state = _state;
	setState = _setState;
};

export const setGlobalState = (val: any) => {
	console.log("setGlobalState", val);
	setState(val);
};

export const getGlobalState = () => {
	//console.log("getGlobalState", state);
	return state;
};

export const updateGlobalState = (key: string, value: any) => {
	console.log("updateGlobalState", key, value);
	if (state[key] === value) {
		//is same
		return;
	}
	state[key] = value;
	setGlobalState({ ...state }); // React voodoo magic
};

export const mergeGlobalState = (state: any) => {
	console.log("mergeGlobalState", state);
	const newState = { ...state, ...state };
	if (JSON.stringify(state) === JSON.stringify(newState)) {
		//is same
		return;
	}
	state = newState;
	setGlobalState({ ...state }); // React voodoo magic
};

export default {
	attachUseState,
	setGlobalState,
	getState: getGlobalState,
	updateState: updateGlobalState,
	mergeState: mergeGlobalState,
	defaultState,
	state,
	setState,
};
