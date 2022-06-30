import { Navigate } from "react-router-dom";
import { Flag } from "../components/Flag";
import { Clock } from "../components/Clock";
import { Digit } from "../components/Digit";
import { IconButton } from "../components/IconButton";
import { BottomTab } from "../components/BottomTab";
import Colorpicker from "../components/Colorpicker";
import TextEdit from "../components/TextEdit";
import ClockEdit from "../components/ClockEdit";

import { scoreboardInterface } from "../utils/ScoreboardInterface";

import { updateGlobalState as updateState, globalState as state } from "../utils/Appstate";
import ToggleSponsors from "../components/ToggleSponsors";

export const Score = () => {
	/*	//Dead code?, moving to backend before declaring it dead code.
	if (state.first) {
		updateState("first", false);

		//Screen to scoreboard
		scoreboardInterface.setScreen("P0");

		scoreboardInterface.resetScore();
		scoreboardInterface.resetTimer();

		scoreboardInterface.changeColor("1B", state.hb);
		scoreboardInterface.changeColor("1O", state.ho);
		scoreboardInterface.changeColor("2B", state.ub);
		scoreboardInterface.changeColor("2O", state.uo);
	}
	*/

	if (!state.isPlaying) {
		return <Navigate to={`/matchsetup`} />;
	}

	const score = (team: string, amt: number) => {
		const name = team == "t1" ? "G1" : "G2";

		if (state[team] == 0 && amt <= 0) {
			return;
		}

		scoreboardInterface.addScore(name, amt);
		updateState(team, state[team] + amt);
	};

	const handleClickMessage = () => {
		updateState("messagePopup", !state.messagePopup);
	};

	const handleClickClock = () => {
		updateState("clockPopup", !state.clockPopup);
	};

	const handleClickSendMessage = (message: string) => {
		updateState("messagePopup", !state.messagePopup);
		scoreboardInterface.sendMessage(message);
		console.log(message);
	};

	const handleClickTeam1Color = () => {
		updateState("teamColorTeam1Popup", !state.teamColorTeam1Popup);
	};

	const handleClickTeam2Color = () => {
		updateState("teamColorTeam2Popup", !state.teamColorTeam2Popup);
	};

	const handleClickToggle = (clicked: string) => {
		if (clicked == "left" && state.scorbordSponsorsToggle != "left") {
			updateState("scorbordSponsorsToggle", "left");
		} else if (clicked == "right" && state.scorbordSponsorsToggle != "right") {
			updateState("scorbordSponsorsToggle", "right");
		}
	};

	return (
		<>
			<div className="p-score">
				<Clock time={state.getClock()} onClick={handleClickClock}></Clock>
				<div className="scorevalue-container">
					<Flag top={state.hb} bottom={state.ho} handleClickPopup={handleClickTeam1Color} />
					<div className="empty"></div>
					<Flag top={state.ub} bottom={state.uo} handleClickPopup={handleClickTeam2Color} />

					<h2 className="teamname">{state.nameHome}</h2>
					<div className="empty"></div>
					<h2 className="teamname">{state.nameOut}</h2>

					<Digit
						value={state.t1}
						style="^v"
						onClickUp={() => {
							score("t1", 1);
						}}
						onClickDown={() => {
							score("t1", -1);
						}}
					/>
					<p className="seperator">-</p>
					<Digit
						value={state.t2}
						style="^v"
						onClickUp={() => {
							score("t2", 1);
						}}
						onClickDown={() => {
							score("t2", -1);
						}}
					/>
				</div>
				<div className="p-score__textedit">
					<IconButton
						icon={
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round">
								<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
							</svg>
						}
						color="white"
						label="WIJZIG BERICHT"
						onClick={handleClickMessage}></IconButton>
				</div>

				<ToggleSponsors handleClickToggle={handleClickToggle} />
			</div>

			<BottomTab />

			<Colorpicker team={1} updateScoreState={updateState} active={state.teamColorTeam1Popup} handleClickPopup={handleClickTeam1Color} />
			<Colorpicker team={2} updateScoreState={updateState} active={state.teamColorTeam2Popup} handleClickPopup={handleClickTeam2Color} />
			<ClockEdit active={state.clockPopup} />
			<TextEdit active={state.messagePopup} handleClickMessage={handleClickMessage} handleClickSendMessage={handleClickSendMessage} />
		</>
	);
};

export default Score;
