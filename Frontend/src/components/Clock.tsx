import { useState } from "react";
import { useRafLoop } from "react-use";

import Socketstate from "../utils/Socketstate";
import { calculateClock } from "../utils/Utils";

export const Clock = ({ onClick }: { onClick?: (event?: any) => any }) => {
	const [value, setValue] = useState("00:00");

	useRafLoop(() => {
		const time = calculateClock(Socketstate.getState().clockData);
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

export default Clock;
