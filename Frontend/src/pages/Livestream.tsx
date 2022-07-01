import { useEffect } from "react";
import { updateGlobalState, state } from "../utils/Appstate";

export const Livestream = () => {
	updateGlobalState("color", "png");

	useEffect(() => {
		const interval = setInterval(() => {
			updateGlobalState("timer", state.getClock());
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
						<div style={{ backgroundColor: state.hb }} className="color-home-top"></div>
						<div style={{ backgroundColor: state.ho }} className="color-home-bottom"></div>
					</div>
					<div className="score-container">
						<p className="score">{state.t1}</p>
					</div>
					<div className="time-container">
						<p className="time">{state.getClock()}</p>
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
