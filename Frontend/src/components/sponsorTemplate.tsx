import { useNavigate } from "react-router-dom";
import { updateGlobalState as updateState, globalState as state } from "../utils/Appstate";

export const SponsorTemplate = ({ name, aantal, handleClickDeletePopup }: { name: string; aantal: number; handleClickDeletePopup: (event?: any) => any }) => {
	const navigate = useNavigate();

	const goToSponsor = async (bundelNaam: string) => {
		navigate(`/sponsor?bundel=${bundelNaam}&serial=${state.serial}`);
	};

	const handleClickDeleteBtn = (name: string) => {
		updateState("sponsorbundelToDelete", name);
		handleClickDeletePopup();
	};

	return (
		<div className="p-sponsorTemplates__list-item">
			<button
				onClick={() => {
					goToSponsor(name);
				}}>
				<div className="p-sponsorTemplates__list-tekst">
					<p className="p-sponsorTemplates__list-title">{name}</p>
					<p>{aantal} sponsors</p>
				</div>
			</button>

			<div className="p-sponsorTemplates__list-btn">
				<button
					onClick={() => {
						goToSponsor(name);
					}}>
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
						<line x1="18" y1="2" x2="22" y2="6"></line>
						<path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path>
					</svg>
				</button>

				<button
					onClick={() => {
						handleClickDeleteBtn(name);
					}}>
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
						<polyline points="3 6 5 6 21 6"></polyline>
						<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
						<line x1="10" y1="11" x2="10" y2="17"></line>
						<line x1="14" y1="11" x2="14" y2="17"></line>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default SponsorTemplate;
