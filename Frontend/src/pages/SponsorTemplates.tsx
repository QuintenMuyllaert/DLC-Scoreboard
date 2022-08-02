import { useNavigate } from "react-router-dom";

import Appstate from "../utils/Appstate";
import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import SponsorTemplate from "../components/sponsorTemplate";
import Header from "../components/Header";
import Backarrow from "../components/Backarrow";
import Modal from "../components/Modal";

import { scoreboardInterface } from "../utils/ScoreboardInterface";

export default () => {
	const { sponsors } = Appstate.getState();
	const navigate = useNavigate();

	const onClickNewReel = () => {
		navigate("/addsponsorbundel");
	};

	const onClickDeleteReel = (folder: string) => {
		Appstate.updateState("modal", {
			visible: true,
			title: "Remove Folder",
			message: "Are you sure you want to remove this folder?",
			buttons: [
				{
					text: "Confirm",
					onClick: async () => {
						scoreboardInterface.emit("sponsors", {
							type: "delete",
							value: {
								folder,
							},
						});
					},
				},
			],
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
			<Header title="Sponsorbundels" icon={<Backarrow />} />
			<div className="p-page p-sponsorTemplates">
				<div className="list">{sponsorBundleElements}</div>
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
			<BottomTab />
			<Modal />
		</>
	);
};
