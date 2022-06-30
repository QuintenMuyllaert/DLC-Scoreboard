import IconButton from "./IconButton";
import { scoreboardInterface } from "../utils/ScoreboardInterface";
import { updateGlobalState as updateState, globalState as state } from "../utils/Appstate";
import { useState } from "react";

export const ClockEdit = ({ active }: { active: boolean }) => {
	const clockDigi = state.getClock();
	const sec = clockDigi.split(":").pop();
	const min = clockDigi.split(":")[0];

	const [minutes, setMinutes] = useState(sec);
	const [seconds, setSeconds] = useState(min);
	const [changedValue, setChangedValue] = useState(false);

	const setTimer = () => {
		console.log("clicker on clock");

		if (state.clockData.paused) {
			scoreboardInterface.resumeTimer();
			console.log("started timer");
		} else if (state.clockData.paused == false) {
			scoreboardInterface.pauseTimer();
			console.log("paused timer");
		}
	};

	const handleClickPopup = () => {
		updateState("clockPopup", !state.clockPopup);
	};

	const setNewTime = () => {
		if (changedValue) {
			console.log("setting new timer...");
			let totalSeconds: number = seconds + minutes * 60;
			if (totalSeconds >= 0) {
				scoreboardInterface.setTimer(totalSeconds);
			} else {
				scoreboardInterface.setTimer(0);
			}
		}

		updateState("clockPopup", !state.clockPopup);
		setChangedValue(false);
	};

	const stopTimer = () => {
		updateState("clockPopup", !state.clockPopup);
		scoreboardInterface.stopMatch();
	};

	return (
		<>
			<div className={active ? "c-clockedit__overlay" : "c-clockedit__overlay c-clockedit__hidden"}></div>
			<div className={active ? "c-clockedit" : "c-clockedit c-clockedit__hidden"}>
				<div className="c-clockedit__container">
					<button className="close" onClick={handleClickPopup}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
					<h1 className="title">Stel een nieuwe tijd in</h1>
					<div className="clockinput">
						<input
							onChange={(event: React.FormEvent<HTMLInputElement>) => {
								setMinutes(parseInt(event.currentTarget.value));
								setChangedValue(true);
							}}
							placeholder="00"
							className="side"
							type="number"
							id="inputclockleft"
						/>
						<p className="middle">:</p>
						<input
							onChange={(event: React.FormEvent<HTMLInputElement>) => {
								setSeconds(parseInt(event.currentTarget.value));
								setChangedValue(true);
							}}
							placeholder="00"
							className="side"
							type="number"
							id="inputclockright"
						/>
					</div>
					<h1 className="title">start of stop de timer</h1>
					<div className="c-clockedit__btns">
						<IconButton
							color="black"
							onClick={setTimer}
							icon={
								state.clockData.paused ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round">
										<polygon points="5 3 19 12 5 21 5 3"></polygon>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round">
										<rect x="6" y="4" width="4" height="16"></rect>
										<rect x="14" y="4" width="4" height="16"></rect>
									</svg>
								)
							}
						/>

						<IconButton
							color="black"
							onClick={stopTimer}
							icon={
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round">
									<path d="M10 2h4"></path>
									<path d="M7.43 7.433A8 8 0 0 1 18.566 18.57M4.582 11A8 8 0 0 0 15 21.419"></path>
									<path d="m2 2 20 20"></path>
									<path d="M12 12v-2"></path>
								</svg>
							}
						/>
					</div>

					<IconButton color="black" label="BEVESTIG" onClick={setNewTime} />
				</div>
			</div>
		</>
	);
};

export default ClockEdit;
