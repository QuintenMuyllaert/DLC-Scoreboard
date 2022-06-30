import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Input } from "../components/Input";
import { IconButton } from "../components/IconButton";
import { LooseObject } from "../utils/Interfaces";
import Flag from "../components/Flag";
import BottomTab from "../components/BottomTab";
import { updateGlobalState as updateState, globalState as state } from "../utils/Appstate";
import Colorpicker from "../components/Colorpicker";
import Logo from "../components/Logo";
import Header from "../components/Header";
import { scoreboardInterface } from "../utils/ScoreboardInterface";

export const MatchSetup = () => {
	if (state.isPlaying) {
		return <Navigate to={`/score`} />;
	}

	const navigate = useNavigate();

	const [checked, setChecked] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [selectedTemplate, setselectedTemplate] = useState("");

	const [dataForBackend, setDataForBackend] = useState({
		halfs: 99999999999999999999,
		halfLength: 99999999999999999999,
	});

	const fetchTemplates = async () => {
		const res = await fetch(`/template?serial=${state.serial}`, { mode: "no-cors", method: "GET" });
		const json = await res.json();
		updateState("templates", json);
	};

	const handleClickMatchStart = async () => {
		console.log("match start clicked!");
		updateState("clockPopup", false);

		if (checked && selectedTemplate == "") {
			const res = await fetch(`/template?serial=${state.serial}`, {
				mode: "no-cors",
				method: "POST",
				cache: "no-cache",
				credentials: "same-origin",
				headers: {
					"content-type": "application/json",
				},
				redirect: "follow",
				referrerPolicy: "no-referrer",
				body: JSON.stringify(newTemplate),
			});

			//navigate(`/score`);
		} else {
			//navigate(`/score`);
		}

		///
		const template = selectedTemplate;
		console.log("template", template);
		console.log("data backend", dataForBackend);
		scoreboardInterface.setMatchData(dataForBackend);

		await scoreboardInterface.startMatch();
		navigate(`/score`);
	};

	useEffect(() => {
		fetchTemplates();
	}, []);

	let templates = [];

	for (const template of state.templates) {
		templates.push(<option value={template.name}>{template.name}</option>);
	}

	const template: LooseObject = {
		name: "",
		parts: 0,
		duration: 0,
	};

	const [newTemplate, setnewTemplate] = useState(template);

	const updateNewTemplate = (key: any, value: string) => {
		newTemplate[key] = value;
		setnewTemplate({ ...newTemplate });
	};

	const templateBackend: LooseObject = {
		halfs: 0,
		halfLength: 0,
	};

	const [templateBack, setTemplateBack] = useState(templateBackend);

	const updateTemplateBackend = (key: any, value: string) => {
		templateBack[key] = value;
		setnewTemplate({ ...templateBack });
	};

	const handleOnchangeSelect = async (selectedValue: string) => {
		setselectedTemplate(selectedValue);
		for (const template of state.templates) {
			if (template.name == selectedTemplate) {
				updateNewTemplate("name", template.name);
				updateNewTemplate("parts", template.parts);
				updateNewTemplate("duration", template.duration);

				updateTemplateBackend("parts", template.parts);
				updateTemplateBackend("duration", template.duration);

				const a = {
					halfs: template.parts,
					halfLength: template.duration,
				};

				setDataForBackend(a);
			}
		}

		if (selectedValue != "") {
			setChecked(true);
			setDisabled(true);
		} else {
			setChecked(false);
			setDisabled(false);
		}

		await scoreboardInterface.setMatchData(templateBackend);
	};

	const handleChecked = () => {
		if (checked) {
			setChecked(false);
		} else {
			setChecked(true);
		}
	};

	const handleClickTeam1Color = () => {
		updateState("teamColorTeam1Popup", !state.teamColorTeam1Popup);
	};

	const handleClickTeam2Color = () => {
		updateState("teamColorTeam2Popup", !state.teamColorTeam2Popup);
	};

	const handleClickSelect = (selectedValue: string) => {
		setselectedTemplate(selectedValue);

		//get template by name
		for (const template of state.templates) {
			if (template.name == selectedValue) {
				updateNewTemplate("name", template.name);
				updateNewTemplate("parts", template.parts);
				updateNewTemplate("duration", template.duration);

				updateTemplateBackend("parts", template.parts);
				updateTemplateBackend("duration", template.duration);
				//setstate inputs
			}
		}
	};

	return (
		<>
			<div className="p-matchsetup maxwidth">
				<Header />
				<h1>Match instellen</h1>
				<div className="teamsettings-container u-grid-vertical-gap">
					<div className="flagcontainer">
						<p>Thuis</p>
						<Flag top={state.hb} bottom={state.ho} handleClickPopup={handleClickTeam1Color} />
					</div>
					<div className="flagcontainer">
						<p>uit</p>
						<Flag top={state.ub} bottom={state.uo} handleClickPopup={handleClickTeam2Color} />
					</div>
				</div>
				<div className="matchsettings-container">
					<div className="c-option">
						<label htmlFor="selectedTemplate">Template selecteren</label>
						<select
							id="selectedTemplate"
							onChange={(e) => {
								if (e.target.value != "0") {
									handleClickSelect(e.target.value);
								} else {
									handleClickSelect("");
								}
							}}>
							<option value="0" selected>
								Selecteer een template
							</option>
							{templates}
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

					<Input
						id="sport"
						label="Naam sport"
						type="text"
						inputValue={newTemplate.name || ""}
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							updateNewTemplate("name", event.currentTarget.value);
						}}
					/>

					<div className="match-helft">
						<div className="helft">
							<Input
								label="Helften"
								type="number"
								id="helften-aantal"
								inputValue={selectedTemplate != "" ? newTemplate.parts : null}
								onChange={(event: React.FormEvent<HTMLInputElement>) => {
									updateNewTemplate("parts", event.currentTarget.value);
								}}
							/>
						</div>
						<div className="duur">
							<Input
								label="Duur helft"
								type="number"
								id="helften-tijd"
								inputValue={selectedTemplate != "" ? newTemplate.duration : null}
								onChange={(event: React.FormEvent<HTMLInputElement>) => {
									updateNewTemplate("duration", event.currentTarget.value);
								}}
							/>
						</div>
					</div>
					<div className="c-checkbox">
						<input type="checkbox" id="saveTemplate" name="saveTemplate" value="Yes" onClick={handleChecked} checked={checked} disabled={disabled} />
						<label htmlFor="saveTemplate">Deze instellingen opslaan als template</label>
					</div>
				</div>
				<div className="p-matchsetup__button">
					<IconButton color="white" label="Start match" onClick={handleClickMatchStart}></IconButton>
				</div>
			</div>
			<BottomTab />

			<Colorpicker team={1} updateScoreState={updateState} active={state.teamColorTeam1Popup} handleClickPopup={handleClickTeam1Color} />
			<Colorpicker team={2} updateScoreState={updateState} active={state.teamColorTeam2Popup} handleClickPopup={handleClickTeam2Color} />
		</>
	);
};

export default MatchSetup;
