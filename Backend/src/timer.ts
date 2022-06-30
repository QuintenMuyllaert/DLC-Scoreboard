export const Timer = class Timer {
	clockStart = Date.now();
	pauseStart = Date.now();
	pauseStop = 0;
	clockOffset = 0;
	paused = true;
	changes = true;
	get data() {
		return {
			clockStart: this.clockStart,
			pauseStart: this.pauseStart,
			pauseStop: this.pauseStop,
			clockOffset: this.clockOffset,
			paused: this.paused,
			clock: this.clockify(),
		};
	}
	constructor() {}
	setData(data: any) {
		if (!data) {
			return;
		}
		this.clockStart = data.clockStart || this.clockStart;
		this.pauseStart = data.pauseStart || this.pauseStart;
		this.pauseStop = data.pauseStop || this.pauseStop;
		this.clockOffset = data.clockOffset || this.clockOffset;
		this.paused = data.paused || this.paused;
	}
	clockify() {
		const now = Date.now();
		const ms = this.paused ? this.pauseStart - this.clockStart - this.clockOffset : now - this.clockStart - this.clockOffset;
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);

		const to2digits = (num: number) => {
			return num < 10 ? `0${num}` : num;
		};

		return `${to2digits(minutes)}:${to2digits(seconds % 60)}`;
	}
	set(time = 0) {
		this.clockStart = Date.now();
		this.pauseStart = Date.now();
		this.pauseStop = 0;
		this.clockOffset = -time * 1000;
		this.changes = true;
	}
	pause() {
		if (this.paused) {
			return;
		}
		this.paused = true;
		this.pauseStart = Date.now();
		this.changes = true;
	}
	resume() {
		if (!this.paused) {
			return;
		}
		this.paused = false;
		this.pauseStop = Date.now();
		this.clockOffset += this.pauseStop - this.pauseStart;
		this.changes = true;
	}
	getSecondsPassed() {
		const now = Date.now();
		const ms = this.paused ? this.pauseStart - this.clockStart - this.clockOffset : now - this.clockStart - this.clockOffset;

		return Math.floor(ms / 1000);
	}
};
