import { useState, useRef, useEffect } from "react";

import IconButton from "./IconButton";
import Appstate from "../utils/Appstate";

import { scoreboardInterface } from "../utils/ScoreboardInterface";
import { calculateClockData, to2digits } from "../utils/Utils";

export default ({ setVisible = () => {} }: { setVisible?: (event?: any) => any }) => {
	const scoreboard = Appstate.getState().scoreboard;
	const clockData = calculateClockData(scoreboard.clockData);
	const [minutes, setMinutes] = useState(clockData.minutes || 0);
	const [seconds, setSeconds] = useState(clockData.seconds || 0);

	const minuteRef = useRef(null);
	const secondRef = useRef(null);

	useEffect(() => {
		//@ts-ignore
		minuteRef.current.value = to2digits(minutes);

		//@ts-ignore
		secondRef.current.value = to2digits(seconds);

		return () => {};
	}, [minutes, seconds]);

	const onClickClose = () => {
		setVisible(false);
	};

	const onClickPause = () => {
		scoreboardInterface.setRealTime(false);
		scoreboard.clockData.paused ? scoreboardInterface.resumeTimer() : scoreboardInterface.pauseTimer();
	};

	const onClickStopMatch = () => {
		scoreboardInterface.stopMatch();
	};

	const onClickConfirm = () => {
		console.log(minutes, seconds);
		scoreboardInterface.setTimer(minutes * 60 + seconds);
		onClickClose();
	};

	const onChangeMinutes = (event: React.FormEvent<HTMLInputElement>) => {
		setMinutes(parseInt(event.currentTarget.value) || 0);
	};

	const onChangeSeconds = (event: React.FormEvent<HTMLInputElement>) => {
		setSeconds(parseInt(event.currentTarget.value) || 0);
	};

	return (
		<div className="c-card c-clockedit">
			<button className="close" onClick={onClickClose}>
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
				<input ref={minuteRef} onChange={onChangeMinutes} placeholder="00" className="side" type="number" id="inputclockleft" />
				<p className="middle">:</p>
				<input ref={secondRef} onChange={onChangeSeconds} placeholder="00" className="side" type="number" id="inputclockright" />
			</div>
			<IconButton color="black" label="INSTELLEN" onClick={onClickConfirm} />
			<h1 className="title">start of stop de timer</h1>
			<div className="buttons">
				<IconButton
					color="black"
					onClick={onClickPause}
					icon={
						scoreboard.clockData.paused ? (
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
					onClick={onClickStopMatch}
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
		</div>
	);
};
