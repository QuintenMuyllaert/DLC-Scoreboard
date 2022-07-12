import { useState } from "react";
import { useRafLoop } from "react-use";

import Appstate from "../utils/Appstate";
import { calculateClock } from "../utils/Utils";
import Logo from "./Logo";

export default ({ title, onClick }: { title: string; onClick?: (event?: any) => any }) => {
	const [value, setValue] = useState("00:00");

	useRafLoop(() => {
		const time = calculateClock(Appstate.getState().scoreboard.clockData);
		if (time != value) {
			setValue(time);
		}
	});

	return (
		<nav className="c-header">
			<div></div>
			<h1>{title}</h1>
			<Logo width="auto" height="100%" />
		</nav>
	);
};
