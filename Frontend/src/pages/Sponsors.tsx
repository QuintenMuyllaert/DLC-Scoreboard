import { useNavigate } from "react-router-dom";

import Appstate from "../utils/Appstate";
import BottomTab from "../components/BottomTab";
import Sponsor from "../components/Sponsor";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import Backarrow from "../components/Backarrow";

import { getQuery } from "../utils/Utils";
import { scoreboardInterface } from "../utils/ScoreboardInterface";

export default () => {
	const navigate = useNavigate();

	const { sponsors } = Appstate.getState();

	const { folder } = getQuery();

	const sponsorElements = [];
	for (const sponsor of sponsors) {
		if (sponsor.name === folder) {
			for (const file of sponsor.children) {
				const imgUrl = `${document.location.origin}/data/${scoreboardInterface.getSerial()}/${folder}/${file}`;

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

	return (
		<>
			<Header title={`"${folder}"`} icon={<Backarrow />} />
			<div className="p-page p-sponsors">
				<div className="list">{sponsorElements}</div>
				<IconButton
					color="white"
					label="Nieuwe Sponsor"
					onClick={handleClickNewSponsor}
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
		</>
	);
};
