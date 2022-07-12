import Appstate from "../utils/Appstate";
import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import SponsorTemplate from "../components/sponsorTemplate";
import { useNavigate } from "react-router-dom";
import { scoreboardInterface } from "../utils/ScoreboardInterface";

export const SponsorTemplates = () => {
	const { sponsors } = Appstate.getState();
	const navigate = useNavigate();

	const onClickNewReel = () => {
		navigate("/addsponsorbundel");
	};

	const onClickDeleteReel = (folder: string) => {
		scoreboardInterface.emit("sponsors", {
			type: "delete",
			value: {
				folder,
			},
		});
	};

	const sponsorBundleElements = [];
	for (const sponsor of sponsors) {
		sponsorBundleElements.push(
			<SponsorTemplate name={sponsor.name} aantal={sponsor.children.length} handleClickDeletePopup={() => onClickDeleteReel(sponsor.name)} />,
		);
	}

	return (
		<>
			<div className="p-page p-sponsorTemplates">
				<h1>Sponsor reels</h1>
				<div className="p-sponsorTemplates__list">{sponsorBundleElements}</div>
				<div className="p-sponsorTemplates__btn">
					<IconButton
						color="white"
						label="SPONSOR MAP"
						onClick={onClickNewReel}
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
		</>
	);
};

export default SponsorTemplates;
