import { useState } from "react";
import { useNavigate } from "react-router-dom";

import IconButton from "../components/IconButton";
import BottomTab from "../components/BottomTab";
import Appstate from "../utils/Appstate";
import Header from "../components/Header";
import Backarrow from "../components/Backarrow";

import { scheduleData } from "../../../Interfaces/Interfaces";
import { scoreboardInterface } from "../utils/ScoreboardInterface";

export default () => {
	const { sponsors, scoreboard } = Appstate.getState();

	const navigate = useNavigate();
	const [startMinutes, setStartMinutes] = useState(scoreboard.scheduleData.startTime);
	const [stopMinutes, setStopMinutes] = useState(scoreboard.scheduleData.endTime);
	const [reel, setReel] = useState([] as string[]);

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

		setReel(uriList);
	};

	const clockify = (time: number) => {
		const hours = Math.floor(time / 60);
		const minutes = time % 60;
		return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
	};

	const toMinutes = (time: string) => {
		const [hours, minutes] = time.split(":").map((x: string) => parseInt(x));
		return hours * 60 + minutes;
	};

	const onChangeClockStart = (event: any) => {
		setStartMinutes(toMinutes(event.target.value));
	};

	const onChangeClockStop = (event: any) => {
		setStopMinutes(toMinutes(event.target.value));
	};

	const onClickSave = () => {
		if (!startMinutes || !stopMinutes) {
			console.log("Start or stop time not set");
			return;
		}

		if (startMinutes > stopMinutes) {
			console.log("Start time is after stop time");
			return;
		}

		if (!reel) {
			console.log("No reel selected");
			return;
		}

		const scheduleData: scheduleData = {
			startTime: startMinutes,
			endTime: stopMinutes,
			sponsors: reel,
		};

		scoreboardInterface.setSchedule(scheduleData);
		navigate("/settings");
	};

	return (
		<>
			<Header title="Schedule" icon={<Backarrow />} />
			<div className="p-page p-schedule">
				<main>
					<div className="timecontainer">
						<div className="c-timepicker">
							<input
								className="c-timepicker"
								type="time"
								id="start"
								name="start"
								min="00:00"
								max="24:00"
								value={clockify(startMinutes)}
								onChange={onChangeClockStart}
							/>
							<label htmlFor="start">Autostart Reel</label>
						</div>
						<div className="c-timepicker">
							<input
								className="c-timepicker"
								type="time"
								id="stop"
								name="stop"
								min="00:00"
								max="24:00"
								value={clockify(stopMinutes)}
								onChange={onChangeClockStop}
							/>
							<label htmlFor="stop">Autostop Reel</label>
						</div>
					</div>

					<div className="c-option">
						<label htmlFor="selectedTemplate">Reel selecteren</label>
						<select id="selectedTemplate" onChange={onChangeTemplate}>
							<>
								<option value="0" selected>
									Selecteer een template
								</option>
								{options}
							</>
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

					<IconButton color="white" label="Opslaan" onClick={onClickSave} />
				</main>
			</div>

			<BottomTab />
		</>
	);
};
