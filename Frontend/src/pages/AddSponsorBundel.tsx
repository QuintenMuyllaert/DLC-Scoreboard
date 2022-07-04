import { useState } from "react";
import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import { scoreboardInterface } from "../utils/ScoreboardInterface";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export const AddSponsorBundel = () => {
	const navigate = useNavigate();
	const [folderName, setFolderName] = useState("");

	const onClickSaveFolder = () => {
		scoreboardInterface.emit("sponsors", {
			type: "create",
			value: {
				folder: folderName,
			},
		});
		navigate(`/sponsortemplates`);
	};

	return (
		<>
			<div className="p-addSponsor element">
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
					page={() => navigate("/sponsortemplates")}
				/>

				<h1>Nieuwe sponsorbundel</h1>

				<div className="p-addSponsor__form">
					<Input
						id="naamBundel"
						label="Naam Nieuwe bundel"
						type="text"
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							setFolderName(event.currentTarget.value);
						}}
					/>
				</div>
				<div className="p-addSponsor__btn">
					<IconButton label="OPSLAAN" color="white" onClick={onClickSaveFolder} />
				</div>
			</div>

			<BottomTab />
		</>
	);
};

export default AddSponsorBundel;
