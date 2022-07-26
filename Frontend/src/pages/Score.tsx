import { useState } from "react";
import { Navigate } from "react-router-dom";

import Header from "../components/Header";
import Flag from "../components/Flag";
import Clock from "../components/Clock";
import Digit from "../components/Digit";
import IconButton from "../components/IconButton";
import BottomTab from "../components/BottomTab";
import Colorpicker from "../components/Colorpicker";
import ClockEdit from "../components/ClockEdit";
import Overlay from "../components/Overlay";

import { scoreboardInterface } from "../utils/ScoreboardInterface";
import Appstate from "../utils/Appstate";

export default () => {
	if (!scoreboardInterface.getSerial()) {
		return <Navigate replace to="/switchscoreboard" />;
	}

	const scoreboard = Appstate.getState().scoreboard;
	if (!scoreboard.isPlaying) {
		return <Navigate to={`/matchsetup`} />;
	}
	const [displayOverlayClock, setDisplayOverlayClock] = useState(false);
	const [displayOverlayColorpickerT, setDisplayOverlayColorpickerT] = useState(false);
	const [displayOverlayColorpickerU, setDisplayOverlayColorpickerU] = useState(false);

	const score = (team: "t1" | "t2", amt: number) => {
		const name = team == "t1" ? "G1" : "G2";

		if (scoreboard[team] + amt < 0 || scoreboard[team] + amt > 99) {
			return;
		}

		scoreboardInterface.addScore(name, amt);
	};

	return (
		<>
			<Header title={scoreboard.name} />
			<div className="p-page p-score">
				<Clock onClick={() => setDisplayOverlayClock(true)}></Clock>
				<div className="container">
					<div className="teamname">
						<Flag top={scoreboard.hb} bottom={scoreboard.ho} onClick={() => setDisplayOverlayColorpickerT(true)} />
						<h2>{scoreboard.nameHome}</h2>
					</div>
					<div className="empty"></div>
					<div className="teamname">
						<Flag top={scoreboard.ub} bottom={scoreboard.uo} onClick={() => setDisplayOverlayColorpickerU(true)} />
						<h2>{scoreboard.nameOut}</h2>
					</div>

					<Digit
						value={scoreboard.t1}
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
						value={scoreboard.t2}
						style="^v"
						onClickUp={() => {
							score("t2", 1);
						}}
						onClickDown={() => {
							score("t2", -1);
						}}
					/>
				</div>
			</div>
			<Overlay visible={displayOverlayClock} setVisible={setDisplayOverlayClock}>
				<ClockEdit setVisible={setDisplayOverlayClock} />
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
