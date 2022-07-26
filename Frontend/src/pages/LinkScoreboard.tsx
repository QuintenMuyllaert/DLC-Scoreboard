import { useState } from "react";

import Header from "../components/Header";
import Input from "../components/Input";
import IconButton from "../components/IconButton";

import Api from "../utils/Api";
import { getQuery } from "../utils/Utils";
import { LooseObject, linkData } from "../../../Interfaces/Interfaces";

export default () => {
	const { serial } = getQuery();

	const defaultState: LooseObject = {
		name: "",
		serial: serial || "",
	};

	const [state, setState] = useState(defaultState);

	const updateState = (key: string, value: string) => {
		setState({ ...state, [key]: value });
	};

	const sendLinkRequest = async () => {
		const linkData: linkData = {
			name: state.name,
			serial: state.serial,
		};

		if (!linkData.name || !linkData.serial) {
			console.log("Missing name or serial");
			return;
		}

		const response = await Api.link(linkData);
		if (response.status !== 201) {
			console.log("Something went wrong");
			return;
		}

		localStorage.setItem("serial", state.serial);

		document.location.href = "/score";
	};

	return (
		<>
			<Header title="Link" />
			<div className="p-page p-manual">
				<div className="content">
					<Input
						id="name"
						label="Naam Scoreboard"
						type="text"
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							updateState("name", event.currentTarget.value);
						}}
					/>
					<Input
						id="serial"
						label="Serienummer"
						type="text"
						inputValue={state.serial}
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							updateState("serial", event.currentTarget.value);
						}}
					/>
				</div>
				<IconButton
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
							strokeLinejoin="round">
							<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
							<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
						</svg>
					}
					label="LINK"
					color="white"
					onClick={sendLinkRequest}
				/>
			</div>
		</>
	);
};
