import { useState, useEffect } from "react";

import Header from "../components/Header";
import IconButton from "../components/IconButton";
import BottomTab from "../components/BottomTab";

export default () => {
	const [options, setOptions] = useState([]);
	const [scoreboards, setScoreboards] = useState([]);
	const [selected, setSelected] = useState("");

	useEffect(() => {
		(async () => {
			console.log("Fetching scoreboards");
			const res = await fetch("/scoreboards");
			const scoreboards = await res.json();
			setScoreboards(scoreboards);

			const opts = [];
			for (const scoreboard of scoreboards) {
				opts.push(<option value={scoreboard.serial}>{scoreboard.name}</option>);
			}

			console.log("Fetched scoreboards", opts);
			setOptions(opts);
		})();

		return () => {};
	}, []);

	const onChangeTemplate = async (event: React.FormEvent<HTMLSelectElement>) => {
		const serial = event.currentTarget.value;
		const selected = scoreboards.find((scoreboard: any) => scoreboard.serial === serial);
		if (!selected) {
			return;
		}

		console.log(selected);
		setSelected(serial);
	};

	const onClickSave = () => {
		localStorage.setItem("serial", selected);
		document.location.href = "/settings"; // IMPORTANT TO HARD RELOAD!
	};

	return (
		<>
			<Header title="Settings" />
			<div className="p-page p-schedule">
				<main>
					<div className="c-option">
						<label htmlFor="selectedTemplate">Scoreboard</label>
						<select id="selectedTemplate" onChange={onChangeTemplate}>
							<option value="0" selected>
								Selecteer een scoreboard
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
						onClick={onClickSave}
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
