import { useEffect } from "react";
import { updateGlobalState, globalState } from "../utils/Appstate";

export const Livestream = () => {
	updateGlobalState("color", "png");

	useEffect(() => {
		const interval = setInterval(() => {
			updateGlobalState("timer", globalState.getClock());
		});

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<main
			className="p-livestream"
			onLoad={(e) => {
				console.log(e);
			}}>
			<header>
				<div className="scoreboard">
					<div className="teamcolors">
						<div style={{ backgroundColor: globalState.hb }} className="color-home-top"></div>
						<div style={{ backgroundColor: globalState.ho }} className="color-home-bottom"></div>
					</div>
					<div className="score-container">
						<p className="score">{globalState.t1}</p>
					</div>
					<div className="time-container">
						<p className="time">{globalState.getClock()}</p>
					</div>
					<div className="score-container">
						<p className="score">{globalState.t2}</p>
					</div>
					<div className="teamcolors">
						<div style={{ backgroundColor: globalState.ub }} className="color-out-top"></div>
						<div style={{ backgroundColor: globalState.uo }} className="color-out-bottom"></div>
					</div>
				</div>
			</header>
		</main>
	);
};

export default Livestream;
