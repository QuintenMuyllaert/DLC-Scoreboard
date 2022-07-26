import { defaultAppState, AppState, AppStateKeys, AppStateValues } from "../../../Interfaces/Interfaces";

export let state: AppState = defaultAppState;
export let setState: any;

export const attachUseState = (_state: any, _setState: any) => {
	state = _state;
	setState = _setState;
};

export const setGlobalState = (val: any) => {
	console.log("setGlobalState", val);
	setState(val);
};

export const getGlobalState = (): AppState => {
	//console.log("getGlobalState", state);
	return state;
};

export const updateGlobalState = (key: AppStateKeys, value: AppStateValues) => {
	console.log("updateGlobalState", key, value);
	//@ts-ignore this works perfectly fine but typescript complains
	state[key] = value;
	setGlobalState({ ...state }); // React voodoo magic
};

export const mergeGlobalState = (state: any) => {
	console.log("mergeGlobalState", state);
	const newState = { ...state, ...state };
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
