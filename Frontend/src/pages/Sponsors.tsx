import { updateGlobalState as updateState, globalState as state } from "../utils/Appstate";
import BottomTab from "../components/BottomTab";
import Logo from "../components/Logo";
import Sponsor from "../components/Sponsor";
import { getQuery } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import ModalConfirm from "../components/ModalConfirm";
import Header from "../components/Header";

export const Sponsors = () => {
	const navigate = useNavigate();

	const fetchSponsors = async () => {
		if (!state.serial || state.serial === "N/A") {
			//TODO : get serial
			console.log("No serial found");
			return;
		}

		const res = await fetch(`/sponsors?serial=${state.serial}`, { mode: "no-cors", method: "GET" });

		if (res.status >= 400) {
			console.log("Invalid reply from server");
			return;
		}

		const json = await res.json();
		updateState("sponsors", json);
	};

	fetchSponsors();

	const handleClickDeletePopup = () => {
		updateState("deleteSponsorPopup", !state.deleteSponsorPopup);
	};

	const handleDeleteSponsor = async () => {
		handleClickDeletePopup();
		console.log(state.deleteSponsorPopup);
		const res = await fetch(`/sponsors?serial=${state.serial}&bundle=${state.sponsorToDelete.bundel}&file=${state.sponsorToDelete.sponsor}`, {
			mode: "cors",
			method: "DELETE",
			cache: "no-cache",
			credentials: "same-origin",
			redirect: "follow",
			referrerPolicy: "no-referrer",
		});

		//TODO : refetch instead
		document.location.href = document.location.href;
	};

	const { bundel } = getQuery();

	let sponsors = [];

	for (const sponsorBundel of state.sponsors) {
		if (sponsorBundel.name === bundel) {
			for (const sponsor of sponsorBundel.children) {
				sponsors.push(<Sponsor img={sponsor} map={sponsorBundel.name} handleClickDeletePopup={handleClickDeletePopup} />);
			}
		}
	}

	const handleClickNewSponsor = async () => {
		navigate(`/addsponsor?bundel=${bundel}`);
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

				<h1>{bundel}</h1>

				<div className="p-sponsors__list">{sponsors}</div>

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
			<ModalConfirm
				active={state.deleteSponsorPopup}
				tekst="Ben je zeker dat je deze sponsor wilt verwijderen?"
				handleClickDeletePopup={handleClickDeletePopup}
				handleDelete={handleDeleteSponsor}
			/>
		</>
	);
};

export default Sponsors;
