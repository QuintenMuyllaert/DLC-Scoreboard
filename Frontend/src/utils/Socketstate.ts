import { LooseObject } from "./Interfaces";

export let socketState: any;
export let SocketSetState: any;

export const defaultState: LooseObject = {
	clockData: {
		realTime: false,
		paused: false,
		startTime: 0,
		startPauseTime: 0,
		pauseTime: 0,
	},
};

export const attachUseState = (state: any, setState: any) => {
	socketState = state;
	SocketSetState = setState;
};

export const setSocketState = (val: any) => {
	console.log("setSocketState", val);
	SocketSetState(val);
};

export const getSocketState = () => {
	console.log("getSocketState", socketState);
	return socketState;
};

export const updateSocketState = (key: string, value: any) => {
	if (socketState[key] === value) {
		//is same
		return;
	}
	socketState[key] = value;
	setSocketState({ ...socketState }); // React voodoo magic
};

export const mergeSocketState = (state: any) => {
	const newState = { ...socketState, ...state };
	if (JSON.stringify(socketState) === JSON.stringify(newState)) {
		//is same
		return;
	}
	socketState = newState;
	setSocketState({ ...socketState }); // React voodoo magic
};

export default {
	attachUseState,
	setState: setSocketState,
	getState: getSocketState,
	updateState: updateSocketState,
	mergeState: mergeSocketState,
	state: socketState,
	defaultState,
};
