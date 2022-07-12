import { useState } from "react";
import { useRafLoop } from "react-use";

import Appstate from "../utils/Appstate";
import { calculateClock } from "../utils/Utils";

export default ({ onClick }: { onClick?: (event?: any) => any }) => {
	const [value, setValue] = useState("00:00");

	useRafLoop(() => {
		const time = calculateClock(Appstate.getState().scoreboard.clockData);
		if (time != value) {
			setValue(time);
		}
	});

	return (
		<div className="c-clock" onClick={onClick}>
			<h1 className="time">{value}</h1>
		</div>
	);
};
