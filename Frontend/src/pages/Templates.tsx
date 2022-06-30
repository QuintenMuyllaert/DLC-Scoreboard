import { ReactElement, ReactEventHandler, useEffect, useState } from "react";
import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";

import Input from "../components/Input";
import Logo from "../components/Logo";
import Template from "../components/Template";
import { LooseObject } from "../utils/Interfaces";
import { updateGlobalState as updateState, globalState as state } from "../utils/Appstate";
import ModalConfirm from "../components/ModalConfirm";
import Header from "../components/Header";

export const Templates = () => {
	const template: LooseObject = {
		name: "",
		parts: 0,
		duration: 0,
	};

	const [newTemplate, setnewTemplate] = useState(template);

	const [templatesList, setTemplateList] = useState(state.templates);

	const updateNewTemplate = (key: any, value: string) => {
		newTemplate[key] = value;
		setnewTemplate(newTemplate);
	};

	const fetchTemplates = async () => {
		const res = await fetch(`/template?serial=${state.serial}`, { mode: "no-cors", method: "GET" });
		const json = await res.json();
		const templates = [];
		for (const template of json) {
			templates.push(
				<Template sportNaam={template.name} aantalHelften={template.parts} duurHelft={template.duration} handleDeletePopup={handleClickDeletePopup} />,
			);

			console.log("single template: ", template);
		}

		setTemplateList(json);

		console.log("list of templates: ", templates);
		//updateState("templates", templates);
		console.log("templates state: ", state.templates);
	};

	const handleClickNewTemplate = async () => {
		const res = await fetch(`/template?serial=${state.serial}`, {
			mode: "cors",
			method: "POST",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"content-type": "application/json",
			},
			redirect: "follow",
			referrerPolicy: "no-referrer",
			body: JSON.stringify(newTemplate),
		});

		//TODO : refetch instead
		document.location.href = document.location.href;
	};

	useEffect(() => {
		(async () => {
			await fetchTemplates();
		})();

		//
	}, []);

	const handleClickDeletePopup = () => {
		updateState("deleteTemplatePopup", !state.deleteTemplatePopup);
	};

	const handleDeleteTemplate = async () => {
		const toDelete: LooseObject = {
			name: state.templateToDelete,
		};

		const res = await fetch(`/template?serial=${state.serial}`, {
			mode: "cors",
			method: "DELETE",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"content-type": "application/json",
			},
			redirect: "follow",
			referrerPolicy: "no-referrer",
			body: JSON.stringify(toDelete),
		});

		updateState("deleteTemplatePopup", !state.deleteTemplatePopup);

		//TODO : refetch instead
		document.location.href = document.location.href;
	};

	const generateTemplates = (templates: any[]) => {
		const reactObj = [];
		for (const template of templates) {
			reactObj.push(
				<Template sportNaam={template.name} aantalHelften={template.parts} duurHelft={template.duration} handleDeletePopup={handleClickDeletePopup} />,
			);
		}
		return reactObj;
	};

	return (
		<>
			<div className="p-templates element">
				<Header />
				<h1>Nieuwe template toevoegen</h1>
				<div className="p-templates__form">
					<Input
						id="naamTemplate"
						label="Naam sport"
						type="text"
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							updateNewTemplate("name", event.currentTarget.value);
							console.log(template);
						}}
					/>

					<div className="p-templates__formgroup">
						<Input
							id="aantalHelften"
							label="Aantal helften"
							type="number"
							onChange={(event: React.FormEvent<HTMLInputElement>) => {
								updateNewTemplate("parts", event.currentTarget.value);
								console.log(template);
							}}
						/>

						<Input
							id="duurHelft"
							label="Duur helft"
							type="number"
							onChange={(event: React.FormEvent<HTMLInputElement>) => {
								updateNewTemplate("duration", event.currentTarget.value);
								console.log(template);
							}}
						/>
					</div>

					<IconButton label="Toevoegen" color="white" onClick={handleClickNewTemplate} />
				</div>

				<h1>Bestaande templates</h1>
				<div className="p-templates__list scrollbar">{generateTemplates(templatesList)}</div>
			</div>
			<BottomTab />
			<ModalConfirm
				active={state.deleteTemplatePopup}
				tekst="Ben je zeker dat je deze template wilt verwijderen?"
				handleClickDeletePopup={handleClickDeletePopup}
				handleDelete={handleDeleteTemplate}
			/>
		</>
	);
};

export default Templates;
