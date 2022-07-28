import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import Appstate from "../utils/Appstate";
import Input from "../components/Input";
import Header from "../components/Header";
import Backarrow from "../components/Backarrow";

import { getQuery } from "../utils/Utils";
import { scoreboardInterface } from "../utils/ScoreboardInterface";
import { LooseObject } from "../../../Interfaces/Interfaces";

export default () => {
	const { id } = getQuery();
	let template: LooseObject = {
		name: "",
		_id: "",
		halfs: 0,
		halfLength: 0,
	};
	template = Appstate.getState().templates.find((template: any) => template._id === id) as any;

	const [inputName, setInputName] = useState(template?.name || "");
	const [inputHalfs, setInputHalfs] = useState(template?.halfs || 0);
	const [inputHalfLength, setInputHalfLength] = useState(template?.halfLength || 0);
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
			<Header title={`Edit "${template?.name || ""}"`} icon={<Backarrow />} />
			<div className="p-page p-templatesettings">
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
