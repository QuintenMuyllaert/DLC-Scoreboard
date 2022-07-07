import { useState } from "react";
import { useRafLoop } from "react-use";
import Appstate from "../utils/Appstate";
import { calculateClock } from "../utils/Utils";
export const Livestream = () => {
	Appstate.updateState("color", "png");
	const state = Appstate.getState().scoreboard;

	const [value, setValue] = useState("00:00");

	useRafLoop(() => {
		const time = calculateClock(Appstate.getState().scoreboard.clockData);
		if (time != value) {
			setValue(time);
		}
	});

	return (
		<main
			className="p-livestream"
			onLoad={(e) => {
				console.log(e);
			}}>
			<header>
				<div className="scoreboard">
					<div className="teamcolors">
						<div style={{ backgroundColor: state.hb }} className="color-home-top"></div>
						<div style={{ backgroundColor: state.ho }} className="color-home-bottom"></div>
					</div>
					<div className="score-container">
						<p className="score">{state.t1}</p>
					</div>
					<div className="time-container">
						<p className="time">{value}</p>
					</div>
					<div className="score-container">
						<p className="score">{state.t2}</p>
					</div>
					<div className="teamcolors">
						<div style={{ backgroundColor: state.ub }} className="color-out-top"></div>
						<div style={{ backgroundColor: state.uo }} className="color-out-bottom"></div>
					</div>
				</div>
			</header>
		</main>
	);
};

export default Livestream;
