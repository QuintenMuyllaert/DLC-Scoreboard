import Appstate from "../utils/Appstate";
import BottomTab from "../components/BottomTab";
import Logo from "../components/Logo";
import Sponsor from "../components/Sponsor";
import { getQuery } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import ModalConfirm from "../components/ModalConfirm";
import Header from "../components/Header";
import { scoreboardInterface } from "../utils/ScoreboardInterface";

export const Sponsors = () => {
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
			<div className="p-sponsors element">
				<Header
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="c-header__back">
							<line x1="19" y1="12" x2="5" y2="12"></line>
							<polyline points="12 19 5 12 12 5"></polyline>
						</svg>
					}
					page={goToSponsorTemplates}
				/>

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

export default Sponsors;
