import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Input } from "../components/Input";
import { IconButton } from "../components/IconButton";
import Flag from "../components/Flag";
import BottomTab from "../components/BottomTab";
import Colorpicker from "../components/Colorpicker";
import Appstate from "../utils/Appstate";
import Overlay from "../components/Overlay";

import { scoreboardInterface } from "../utils/ScoreboardInterface";

export const MatchSetup = () => {
	const { scoreboard, templates } = Appstate.getState();
	if (scoreboard.isPlaying) {
		return <Navigate to={`/score`} />;
	}

	const navigate = useNavigate();
	const [displayOverlayColorpickerT, setDisplayOverlayColorpickerT] = useState(false);
	const [displayOverlayColorpickerU, setDisplayOverlayColorpickerU] = useState(false);

	const [inputHalfs, setInputHalfs] = useState("0");
	const [inputHalfLength, setInputHalfLength] = useState("0");

	const options = [];
	for (const template of templates) {
		options.push(<option value={template.name}>{template.name}</option>);
	}

	const onChangeTemplate = (event: React.FormEvent<HTMLSelectElement>) => {
		const template = templates.find((template: any) => template.name === event.currentTarget.value);
		if (template) {
			setInputHalfs(template.halfs.toString());
			setInputHalfLength(template.halfLength.toString());
		}
	};

	return (
		<>
			<div className="p-page p-matchsetup maxwidth">
				<h1>Match instellen</h1>
				<div className="teamsettings-container u-grid-vertical-gap">
					<div className="flagcontainer">
						<p>{scoreboard.nameHome}</p>
						<Flag top={scoreboard.hb} bottom={scoreboard.ho} onClick={() => setDisplayOverlayColorpickerT(true)} />
					</div>
					<div className="flagcontainer">
						<p>{scoreboard.nameOut}</p>
						<Flag top={scoreboard.ub} bottom={scoreboard.uo} onClick={() => setDisplayOverlayColorpickerU(true)} />
					</div>
				</div>
				<div className="matchsettings-container">
					<div className="c-option">
						<label htmlFor="selectedTemplate">Template selecteren</label>
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

					<div className="match-helft">
						<div className="helft">
							<Input
								label="Helften"
								type="number"
								id="helften-aantal"
								inputValue={inputHalfs}
								onChange={(event: React.FormEvent<HTMLInputElement>) => {
									setInputHalfs(event.currentTarget.value);
								}}
							/>
						</div>
						<div className="duur">
							<Input
								label="Duur helft"
								type="number"
								id="helften-tijd"
								inputValue={inputHalfLength}
								onChange={(event: React.FormEvent<HTMLInputElement>) => {
									setInputHalfLength(event.currentTarget.value);
								}}
							/>
						</div>
					</div>
				</div>
				<div className="p-matchsetup__button">
					<IconButton
						color="white"
						label="Start match"
						onClick={() => {
							scoreboardInterface.startMatch(parseInt(inputHalfs), parseInt(inputHalfLength));
							navigate("/score");
						}}></IconButton>
				</div>
			</div>
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

export default MatchSetup;
