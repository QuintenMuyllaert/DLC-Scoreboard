import { clockData } from "./schema/schema";

export const Timer = class Timer {
	realTime = false;
	paused = false;
	startTime = Date.now();
	startPauseTime = 0;
	pauseTime = 0;
	pauseAt: number[] = [];
	triggerUpdate = () => {};
	get data() {
		return {
			realTime: this.realTime,
			paused: this.paused,
			startTime: this.startTime,
			startPauseTime: this.startPauseTime,
			pauseTime: this.pauseTime,
		};
	}
	set data(data: clockData) {
		this.realTime = data.realTime;
		this.paused = data.paused;
		this.startTime = data.startTime;
		this.startPauseTime = data.startPauseTime;
		this.pauseTime = data.pauseTime;
	}
	constructor() {
		setInterval(() => {
			if (this.paused) {
				return;
			}
			if (!this.pauseAt.length) {
				return;
			}

			const millis = Date.now() - this.startTime - this.pauseTime;
			if (millis >= this.pauseAt[0]) {
				this.pauseAt.shift();
				this.pause();
				console.log("autoPause hit", millis);
				this.triggerUpdate();
			}
		}, 1);
	}
	set(time = 0) {
		console.log("set", time);
		this.startTime = Date.now();
		this.startPauseTime = Date.now();
		this.pauseTime = -time * 1000;
	}
	pause() {
		console.log("pause");
		if (this.paused) {
			return;
		}
		this.paused = true;
		this.startPauseTime = Date.now();
	}
	resume() {
		console.log("resume");
		if (!this.paused) {
			return;
		}
		this.paused = false;
		this.pauseTime += Date.now() - this.startPauseTime;
	}
	autoPause(millis: number) {
		console.log("autoPause", millis);
		if (this.pauseAt.includes(millis)) {
			console.warn("autoPause: already paused at", millis);
			return;
		}
		this.pauseAt.push(millis);
		this.pauseAt.sort((a, b) => a - b);
		console.log("autoPause:", this.pauseAt);
	}
	clearAutoPause() {
		console.log("clearAutoPause");
		this.pauseAt = [];
	}
};
