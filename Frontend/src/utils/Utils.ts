import { LooseObject, clockData } from "../../../Interfaces/interfaces";

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCookies = () => {
	const cookies: LooseObject = {};
	document.cookie.split(";").forEach((cookie) => {
		const [key, value] = cookie.split("=");
		try {
			cookies[key.trim()] = JSON.parse(value);
		} catch (e) {
			cookies[key.trim()] = value;
		}
	});

	return cookies;
};

export const getQuery = () => {
	const query = window.location.search.substring(1);
	const arrayb = query.split("&");
	const querryObject: LooseObject = {};
	for (const item of arrayb) {
		const key = item.split("=")[0];
		const value = item.replace(`${key}=`, "");
		querryObject[key] = decodeURIComponent(value);
	}
	return querryObject;
};

export const to2digits = (num: number) => {
	return num < 10 ? `0${num}` : num;
};

export const processTime = (ms: number) => {
	const totalSeconds = ms / 1000;
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = Math.floor(totalSeconds % 60);
	const millis = Math.floor(ms % 1000);
	return { minutes, seconds, millis };
};

export const clockify = (ms: number) => {
	//ms must be >= 0
	ms = Math.max(0, ms);
	const { minutes, seconds } = processTime(ms);
	return `${to2digits(minutes)}:${to2digits(seconds)}`;
};

export const calculateClockData = (clockData: clockData) => {
	const now = Date.now();

	let delta = 0;
	if (clockData.paused) {
		delta = clockData.startPauseTime - clockData.startTime - clockData.pauseTime;
	} else {
		delta = now - clockData.startTime - clockData.pauseTime;
	}

	return processTime(delta);
};

export const calculateClock = (clockData: clockData) => {
	let display = "00:00";
	const now = Date.now();
	if (clockData.realTime) {
		const realTime = new Date(now);
		const hours = realTime.getHours();
		const minutes = realTime.getMinutes();
		display = clockify((hours * 60 + minutes) * 1000);
	} else if (clockData.paused) {
		const delta = clockData.startPauseTime - clockData.startTime - clockData.pauseTime;
		display = clockify(delta);
	} else {
		const delta = now - clockData.startTime - clockData.pauseTime;
		display = clockify(delta);
	}

	return display;
};
