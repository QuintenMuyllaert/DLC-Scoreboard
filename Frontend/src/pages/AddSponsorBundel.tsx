import { useState } from "react";
import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import { scoreboardInterface } from "../utils/ScoreboardInterface";
import { useNavigate } from "react-router-dom";

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
