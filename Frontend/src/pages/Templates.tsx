import { ReactElement, ReactEventHandler, useState } from "react";

import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import Template from "../components/Template";

import Appstate from "../utils/Appstate";
import { scoreboardInterface } from "../utils/ScoreboardInterface";

export const Templates = () => {
	const [inputName, setInputName] = useState("");
	const [inputHalfs, setInputHalfs] = useState("0");
	const [inputHalfLength, setInputHalfLength] = useState("0");

	const templateElements: ReactElement[] = [];
	const templates = Appstate.getState().templates;
	console.log(templates);
	for (const template of templates) {
		templateElements.push(<Template id={template._id} name={template.name} halfs={template.halfs} halfLength={template.halfLength} />);
	}

	const onClickAddTemplate = (e: ReactEventHandler) => {
		if (!inputName || !inputHalfs || !inputHalfLength) {
			return;
		}

		const newTemplate = {
			name: inputName,
			halfs: parseInt(inputHalfs),
			halfLength: parseInt(inputHalfLength),
		};
		Appstate.updateState("templates", [...Appstate.getState().templates, newTemplate]);
		scoreboardInterface.emit("template", { type: "create", value: newTemplate });

		setInputName("");
		setInputHalfs("0");
		setInputHalfLength("0");
	};

	return (
		<>
			<div className="p-templates element">
				<h1>Nieuwe template toevoegen</h1>
				<div className="p-templates__form">
					<Input
						id="sport"
						label="Naam sport"
						type="text"
						inputValue={inputName}
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							setInputName(event.currentTarget.value);
						}}
					/>

					<div className="p-templates__formgroup">
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

					<IconButton label="Toevoegen" color="white" onClick={onClickAddTemplate} />
				</div>

				<h1>Bestaande templates</h1>
				<div className="p-templates__list scrollbar">{templateElements}</div>
			</div>
			<BottomTab />
		</>
	);
};

export default Templates;
