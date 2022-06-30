import { useState } from "react";
import { updateGlobalState as updateState, globalState as state } from "../utils/Appstate";
import { LooseObject } from "../utils/Interfaces";

export const Sponsor = ({ img, map, handleClickDeletePopup }: { img: string; map: string; handleClickDeletePopup: (event?: any) => any }) => {
	const imgUrl = `${document.location.origin}/data/${state.serial}/${map}/${img}`;

	const toDelete: LooseObject = {
		bundel: "",
		sponsor: "",
	};

	const [sponsorToDelete, setSponsorToDelete] = useState(toDelete);

	const updateSponsorToDelete = (key: any, value: string) => {
		sponsorToDelete[key] = value;
		setSponsorToDelete(sponsorToDelete);
	};

	const handleClickDeleteBtn = (sponsorBundel: string, sponsor: string) => {
		updateSponsorToDelete("bundel", map);
		updateSponsorToDelete("sponsor", img);
		updateState("sponsorToDelete", sponsorToDelete);
		handleClickDeletePopup();
	};

	return (
		<article className="p-sponsors__list-item">
			<div className="p-sponsors__list-img">
				<img src={imgUrl} alt={img} />
			</div>
			<p>{img}</p>
			<button
				className="p-sponsors__list-btn"
				onClick={() => {
					handleClickDeleteBtn(map, img);
				}}>
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
					<polyline points="3 6 5 6 21 6"></polyline>
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
					<line x1="10" y1="11" x2="10" y2="17"></line>
					<line x1="14" y1="11" x2="14" y2="17"></line>
				</svg>
			</button>
		</article>
	);
};

export default Sponsor;
