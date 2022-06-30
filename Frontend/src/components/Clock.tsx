import { useEffect, useState } from "react";
import { getGlobalState } from "../utils/Appstate";
export const Clock = ({ time, onClick }: { time: number | `${number}:${number}`; onClick?: (event?: any) => any }) => {
	let display = "";

	if (typeof time === "string") {
		display = time;
	} else {
		let sec: number | string = time % 60;
		let min: number | string = (time - sec) / 60;

		sec = sec < 0 ? 0 : sec;
		min = min < 0 ? 0 : min;

		if (min < 10) {
			min = `0${min}`;
		}

		if (sec < 10) {
			sec = `0${sec}`;
		}

		display = `${min}:${sec}`;
	}

	const [value, setValue] = useState("00:00");

	useEffect(() => {
		const interval = setInterval(() => {
			const state = getGlobalState();
			setValue(state.getClock());
		}, 50);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<div className="c-clock" onClick={onClick}>
			<h1 className="time">{value}</h1>
		</div>
	);
};

export default Clock;
