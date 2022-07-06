import { defaultAppState, AppState, AppStateKeys, AppStateValues } from "../../../Interfaces/interfaces";

export let state: AppState;
export let setState: any;

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

export const updateGlobalState = (key: AppStateKeys, value: AppStateValues) => {
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
	defaultState: defaultAppState,
};
