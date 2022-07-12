import Appstate from "../utils/Appstate";
import BottomTab from "../components/BottomTab";
import Logo from "../components/Logo";
import Sponsor from "../components/Sponsor";
import { getQuery } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import { scoreboardInterface } from "../utils/ScoreboardInterface";

export default () => {
	const navigate = useNavigate();

	const { sponsors, jwt } = Appstate.getState();

	const { folder } = getQuery();

	const sponsorElements = [];
	for (const sponsor of sponsors) {
		if (sponsor.name === folder) {
			for (const file of sponsor.children) {
				const imgUrl = `${document.location.origin}/data/${jwt?.serial}/${folder}/${file}`;

				sponsorElements.push(
					<Sponsor
						imgUrl={imgUrl}
						onClick={() => {
							scoreboardInterface.emit("sponsors", {
								type: "delete",
								value: {
									folder,
									file,
								},
							});
						}}
					/>,
				);
			}
		}
	}

	const handleClickNewSponsor = async () => {
		navigate(`/addsponsor?folder=${folder}`);
	};

	const goToSponsorTemplates = () => {
		navigate(`/sponsortemplates`);
	};

	return (
		<>
			<div className="p-page p-sponsors element">
				<h1>{folder}</h1>

				<div className="p-sponsors__list">{sponsorElements}</div>

				<button className="p-sponsors__add" onClick={handleClickNewSponsor}>
					<div className="p-sponsors__add-placeholder">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="30"
							height="30"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round">
							<line x1="12" y1="5" x2="12" y2="19"></line>
							<line x1="5" y1="12" x2="19" y2="12"></line>
						</svg>
					</div>
					<p>Nieuwe sponsor</p>
				</button>
			</div>
			<BottomTab />
		</>
	);
};
