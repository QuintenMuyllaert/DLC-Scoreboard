export interface LooseObject {
	[key: string]: any;
}

export interface clockData {
	realTime: boolean;
	paused: boolean;
	startTime: number;
	startPauseTime: number;
	pauseTime: number;
}
