import { useState, useEffect } from "react";

import Appstate from "../utils/Appstate";
import { calculateClock } from "../utils/Utils";

export default ({ onClick }: { onClick?: (event?: any) => any }) => {
	const [value, setValue] = useState("00:00");

	useEffect(() => {
		const interval = setInterval(() => {
			const time = calculateClock(Appstate.getState().scoreboard.clockData);
			if (time != value) {
				setValue(time);
			}
		}, 1000 / 60);
		return () => clearInterval(interval);
	});

	return (
		<div className="c-clock" onClick={onClick}>
			<h1 className="time">{value}</h1>
		</div>
	);
};
