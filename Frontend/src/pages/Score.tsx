import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Flag } from "../components/Flag";
import { Clock } from "../components/Clock";
import { Digit } from "../components/Digit";
import { IconButton } from "../components/IconButton";
import { BottomTab } from "../components/BottomTab";
import { Colorpicker } from "../components/Colorpicker";
import { TextEdit } from "../components/TextEdit";
import { ClockEdit } from "../components/ClockEdit";
import { Overlay } from "../components/Overlay";

import { scoreboardInterface } from "../utils/ScoreboardInterface";

import { socketState } from "../utils/Socketstate";
import ToggleSponsors from "../components/ToggleSponsors";

export const Score = () => {
	const [displayOverlayClock, setDisplayOverlayClock] = useState(false);
	const [displayOverlayMessage, setDisplayOverlayMessage] = useState(false);
	const [displayOverlayColorpickerT, setDisplayOverlayColorpickerT] = useState(false);
	const [displayOverlayColorpickerU, setDisplayOverlayColorpickerU] = useState(false);
	/*if (!state.isPlaying) {
		return <Navigate to={`/matchsetup`} />;
	}*/

	const score = (team: string, amt: number) => {
		const name = team == "t1" ? "G1" : "G2";

		if (socketState[team] == 0 && amt <= 0) {
			return;
		}

		scoreboardInterface.addScore(name, amt);
		//updateState(team, state[team] + amt);
	};

	return (
		<>
			<div className="p-score">
				<Clock onClick={() => setDisplayOverlayClock(true)}></Clock>
				<div className="scorevalue-container">
					<Flag top={socketState.hb} bottom={socketState.ho} onClick={() => setDisplayOverlayColorpickerT(true)} />
					<div className="empty"></div>
					<Flag top={socketState.ub} bottom={socketState.uo} onClick={() => setDisplayOverlayColorpickerU(true)} />

					<h2 className="teamname">{socketState.nameHome}</h2>
					<div className="empty"></div>
					<h2 className="teamname">{socketState.nameOut}</h2>

					<Digit
						value={socketState.t1}
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
						value={socketState.t2}
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
						onClick={() => setDisplayOverlayMessage(true)}></IconButton>
				</div>

				{/*<ToggleSponsors handleClickToggle={handleClickToggle} />*/}
			</div>
			<Overlay visible={displayOverlayClock} setVisible={setDisplayOverlayClock}>
				<ClockEdit setVisible={setDisplayOverlayClock} />
			</Overlay>
			<Overlay visible={displayOverlayMessage} setVisible={setDisplayOverlayMessage}>
				<TextEdit setVisible={setDisplayOverlayMessage} />
			</Overlay>
			<Overlay visible={displayOverlayColorpickerT} setVisible={setDisplayOverlayColorpickerT}>
				<Colorpicker team={1} setVisible={setDisplayOverlayColorpickerT} />
			</Overlay>
			<Overlay visible={displayOverlayColorpickerU} setVisible={setDisplayOverlayColorpickerU}>
				<Colorpicker team={2} setVisible={setDisplayOverlayColorpickerU} />
			</Overlay>
			<BottomTab />
		</>
	);
};

export default Score;
