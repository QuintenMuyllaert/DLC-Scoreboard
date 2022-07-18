import { useNavigate } from "react-router-dom";

import IconButton from "../components/IconButton";
import BottomTab from "../components/BottomTab";

import { scoreboardInterface } from "../utils/ScoreboardInterface";
import Appstate from "../utils/Appstate";
import Header from "../components/Header";

export default () => {
	const navigate = useNavigate();

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
			const uri = `${document.location.origin}/data/${jwt.serial}/${encodeURIComponent(name)}/${encodeURIComponent(sponsor)}`;
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
			<Header title="Settings" />
			<div className="p-page p-schedule">
				<main>
					<div className="timecontainer">
						<div className="c-timepicker">
							<input className="c-timepicker" type="time" id="appt" name="appt" min="00:00" max="24:00" />
							<label htmlFor="appt">Autostart Reel</label>
						</div>
						<div className="c-timepicker">
							<input className="c-timepicker" type="time" id="appt" name="appt" min="00:00" max="24:00" />
							<label htmlFor="appt">Autostop Reel</label>
						</div>
					</div>

					<div className="c-option">
						<label htmlFor="selectedTemplate">Reel selecteren</label>
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

					<IconButton
						color="white"
						label="Opslaan"
						onClick={() => navigate("/users")}
						icon={
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="c-bottomtab__page-icon">
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
								<circle cx="9" cy="7" r="4"></circle>
								<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
								<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
							</svg>
						}
					/>
				</main>
			</div>

			<BottomTab />
		</>
	);
};
