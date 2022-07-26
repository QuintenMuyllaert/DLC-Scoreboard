import { useState } from "react";

import IconButton from "../components/IconButton";
import BottomTab from "../components/BottomTab";

import { scoreboardInterface } from "../utils/ScoreboardInterface";
import Appstate from "../utils/Appstate";
import Switch from "../components/Switch";
import Header from "../components/Header";
import TextEdit from "../components/TextEdit";
import Overlay from "../components/Overlay";

export default () => {
	const [displayOverlayMessage, setDisplayOverlayMessage] = useState(false);

	const { sponsors, jwt, scoreboard, color } = Appstate.getState();
	const options = [];
	for (const sponsor of sponsors) {
		options.push(<option value={sponsor.name}>{sponsor.name}</option>);
	}

	const onChangeTemplate = async (event: React.FormEvent<HTMLSelectElement>) => {
		const name = event.currentTarget.value;
		const selected = sponsors.find((sponsor: any) => sponsor.name === name);
		if (!selected) {
			return;
		}

		let uriList = [];
		for (const sponsor of selected.children) {
			const uri = `${document.location.origin}/data/${scoreboardInterface.getSerial()}/${encodeURIComponent(name)}/${encodeURIComponent(sponsor)}`;
			if (sponsor.endsWith(".json")) {
				const res = await fetch(uri);
				const json = await res.json();
				uriList.push(json.uri);
			} else {
				uriList.push(uri);
			}
		}

		scoreboardInterface.setSponsorReel(uriList);
	};

	return (
		<>
			<Header title="Screen" />
			<div className="p-page p-screen">
				<div className="c-option">
					<label htmlFor="selectedTemplate">Sponsor selecteren</label>
					<select id="selectedTemplate" onChange={onChangeTemplate}>
						<option value="0" selected>
							Selecteer een template
						</option>
						{options}
					</select>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</div>
				<div>
					<p>OFF/ON</p>
					<Switch
						checked={scoreboard.display}
						onChange={() => {
							scoreboardInterface.enableDisplay(!scoreboard.display);
						}}
					/>
				</div>
				<div>
					<p>Fullscreen</p>
					<Switch
						checked={scoreboard.fullscreen}
						onChange={() => {
							scoreboardInterface.setFullScreenSponsors(!scoreboard.fullscreen);
						}}
					/>
				</div>
				<div>
					<p>Realtime</p>
					<Switch
						checked={scoreboard.clockData.realTime}
						onChange={() => {
							scoreboardInterface.setRealTime(!scoreboard.clockData.realTime);
						}}
					/>
				</div>
				<div>
					<p>Light/Dark</p>
					<Switch
						checked={color == "dark"}
						onChange={() => {
							localStorage.setItem("theme", color == "dark" ? "light" : "dark");
							Appstate.updateState("color", localStorage.getItem("theme"));
						}}
					/>
				</div>
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
			<Overlay visible={displayOverlayMessage} setVisible={setDisplayOverlayMessage}>
				<TextEdit setVisible={setDisplayOverlayMessage} />
			</Overlay>
			<BottomTab />
		</>
	);
};
