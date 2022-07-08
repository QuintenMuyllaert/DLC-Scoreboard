import { useState } from "react";
import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import { getQuery } from "../utils/Utils";
import Appstate from "../utils/Appstate";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { scoreboardInterface } from "../utils/ScoreboardInterface";

export const TemplateSettings = () => {
	const { id } = getQuery();
	const template = Appstate.getState().templates.find((template: any) => template._id === id);

	const [inputName, setInputName] = useState(template.name);
	const [inputHalfs, setInputHalfs] = useState(template.halfs);
	const [inputHalfLength, setInputHalfLength] = useState(template.halfLength);
	const navigate = useNavigate();

	const onClickSave = () => {
		const newTemplate = {
			name: inputName,
			halfs: parseInt(inputHalfs),
			halfLength: parseInt(inputHalfLength),
			_id: id,
		};
		Appstate.updateState("templates", [...Appstate.getState().templates.filter((template: any) => template._id !== id), newTemplate]);
		scoreboardInterface.emit("template", { type: "update", value: newTemplate });
		navigate("/templates");
	};

	return (
		<>
			<div className="p-page p-templatesettings element">
				<h1 className="pagetitle">{template.name}</h1>

				<div className="content">
					<Input
						id="sport"
						label="Naam sport"
						type="text"
						inputValue={inputName}
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							setInputName(event.currentTarget.value);
						}}
					/>

					<Input
						label="Helften"
						type="number"
						id="helften-aantal"
						inputValue={inputHalfs}
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							setInputHalfs(event.currentTarget.value);
						}}
					/>

					<Input
						label="Duur helft"
						type="number"
						id="helften-tijd"
						inputValue={inputHalfLength}
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							setInputHalfLength(event.currentTarget.value);
						}}
					/>
				</div>
				<div className="p-templatesettings__btn">
					<IconButton label="OPSLAAN" color="white" onClick={onClickSave} />
				</div>
			</div>
			<BottomTab />
		</>
	);
};

export default TemplateSettings;
