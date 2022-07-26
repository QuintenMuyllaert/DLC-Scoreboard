import { useState } from "react";
import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import Header from "../components/Header";
import { scoreboardInterface } from "../utils/ScoreboardInterface";
import { useNavigate } from "react-router-dom";
import Backarrow from "../components/Backarrow";

export default () => {
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
			<Header title="Sponsorbundel toevoegen" icon={<Backarrow />} />
			<div className="p-page p-addSponsor">
				<Input
					id="naamBundel"
					label="Naam Nieuwe bundel"
					type="text"
					onChange={(event: React.FormEvent<HTMLInputElement>) => {
						setFolderName(event.currentTarget.value);
					}}
				/>
				<IconButton label="OPSLAAN" color="white" onClick={onClickSaveFolder} />
			</div>
			<BottomTab />
		</>
	);
};
