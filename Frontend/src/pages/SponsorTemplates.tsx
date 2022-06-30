import { useEffect } from "react";

import { updateGlobalState as updateState, globalState as state } from "../utils/Appstate";
import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import Logo from "../components/Logo";
import SponsorTemplate from "../components/sponsorTemplate";
import { useNavigate } from "react-router-dom";
import ModalConfirm from "../components/ModalConfirm";
import Header from "../components/Header";

export const SponsorTemplates = () => {
	const navigate = useNavigate();

	const fetchSponsors = async () => {
		if (!state.serial || state.serial === "N/A") {
			const res = await fetch("/status");
			const body = await res.json();
			state.serial = body.serial;
			updateState("serial", body.serial);
		}

		const res = await fetch(`/sponsors?serial=${state.serial}`, { mode: "no-cors", method: "GET" });
		const json = await res.json();
		updateState("sponsors", json);
	};

	useEffect(() => {
		fetchSponsors();
	}, []);

	const handleClickNewBundel = (bundelNaam: string) => {
		navigate(`/addsponsorbundel`);
	};

	const handleClickDeletePopup = () => {
		updateState("deleteSponsorbundelPopup", !state.deleteSponsorbundelPopup);
	};

	let sponsors = [];
	for (const sponsorBundel of state.sponsors) {
		sponsors.push(<SponsorTemplate name={sponsorBundel.name} aantal={sponsorBundel.children.length} handleClickDeletePopup={handleClickDeletePopup} />);
	}

	const handleDeleteSponsorbundel = async () => {
		handleClickDeletePopup();
		console.log(state.deleteSponsorPopup);
		const res = await fetch(`/folder?serial=${state.serial}&bundle=${state.sponsorbundelToDelete}`, {
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

	return (
		<>
			<div className="p-sponsorTemplates element">
				<Header />
				<h1>Sponsor bundels</h1>
				<div className="p-sponsorTemplates__list">{sponsors}</div>
				<div className="p-sponsorTemplates__btn">
					<IconButton
						color="white"
						label="Nieuwe bundel"
						onClick={handleClickNewBundel}
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
								className="c-header__back">
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
						}></IconButton>
				</div>
			</div>
			<BottomTab />
			<ModalConfirm
				active={state.deleteSponsorbundelPopup}
				tekst="Ben je zeker dat je deze sponsorbundel wilt verwijderen?"
				handleClickDeletePopup={handleClickDeletePopup}
				handleDelete={handleDeleteSponsorbundel}
			/>
		</>
	);
};

export default SponsorTemplates;
