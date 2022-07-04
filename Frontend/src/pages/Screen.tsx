import IconButton from "../components/IconButton";
import BottomTab from "../components/BottomTab";

import { scoreboardInterface } from "../utils/ScoreboardInterface";
import Appstate from "../utils/Appstate";

export const Screen = () => {
	const { sponsors, jwt } = Appstate.getState();
	const options = [];
	for (const sponsor of sponsors) {
		options.push(<option value={sponsor.name}>{sponsor.name}</option>);
	}

	const onChangeTemplate = (event: React.FormEvent<HTMLSelectElement>) => {
		const name = event.currentTarget.value;
		const selected = sponsors.find((sponsor: any) => sponsor.name === name);
		if (!selected) {
			return;
		}

		let uriList = [];
		for (const sponsor of selected.children) {
			uriList.push(`${document.location.origin}/data/${jwt.serial}/${encodeURIComponent(name)}/${encodeURIComponent(sponsor)}`);
		}

		scoreboardInterface.setSponsorReel(uriList);
	};

	return (
		<>
			<div className="p-screen">
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
			</div>
			<BottomTab />
		</>
	);
};

export default Screen;
