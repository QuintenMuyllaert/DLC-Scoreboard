import { useState } from "react";
import Input from "../components/Input";
import Logo from "../components/Logo";
import IconButton from "../components/IconButton";
import { LooseObject } from "../../../Interfaces/interfaces";
import Api from "../utils/Api";
import { getQuery } from "../utils/Utils";
import Appstate from "../utils/Appstate";

export default () => {
	const { serial } = getQuery();
	const { jwt } = Appstate.getState();

	const defaultState: LooseObject = {
		serial: serial || "",
		username: "",
		password: "",
		email: "",
		confirmPassword: "",
		hasScoreboard: true,
	};

	const validation: LooseObject = {
		message: "",
		display: false,
	};

	const [validationState, setValidation] = useState(validation);
	const [state, setState] = useState(defaultState);

	const updateValidation = (key: any, value: any) => {
		validation[key] = value;
		setValidation(validation);
	};

	const updateState = (key: string, value: any) => {
		state[key] = value;
		setState({ ...state });
	};

	const onCheck = () => {
		updateState("hasScoreboard", !state.hasScoreboard);
	};

	const sendRegisterRequest = async () => {
		if (state.password !== state.confirmPassword) {
			updateValidation("message", "wachtwoord is niet gelijk aan bevestig wachtwoord");
			updateValidation("display", true);
			return;
		}

		if (state.password === state.confirmPassword) {
			if (state.hasScoreboard) {
				const res = await Api.register({
					username: state.username,
					password: state.password,
					serial: state.serial,
					email: state.email,
					name: state.name,
				});

				const message = await res.text();
				updateValidation("message", message);

				if (res.status >= 200 && res.status < 300) {
					updateValidation("display", false);
					const res = await fetch(`/auth`, {
						method: "POST",
						mode: "cors",
						cache: "no-cache",
						credentials: "same-origin",
						headers: {
							"Content-Type": "application/json",
						},
						redirect: "follow",
						referrerPolicy: "no-referrer",
						body: JSON.stringify({ username: state.username, password: state.password }),
					});

					document.location.href = "/score";
				}

				if (res.status >= 400) {
					updateValidation("display", true);
				}
			}

			if (state.hasScoreboard == false) {
				updateState("serial", "virtual");

				const res = await fetch(`${document.location.origin}/register`, {
					method: "POST",
					mode: "cors",
					cache: "no-cache",
					credentials: "same-origin",
					headers: {
						"Content-Type": "application/json",
					},
					redirect: "follow",
					referrerPolicy: "no-referrer",
					body: JSON.stringify({ ...state }),
				});

				const message = await res.text();
				updateValidation("message", message);

				if (res.status >= 200 && res.status < 300) {
					updateValidation("display", false);
					const res = await fetch(`/auth`, {
						method: "POST",
						mode: "cors",
						cache: "no-cache",
						credentials: "same-origin",
						headers: {
							"Content-Type": "application/json",
						},
						redirect: "follow",
						referrerPolicy: "no-referrer",
						body: JSON.stringify({ username: state.username, password: state.password }),
					});

					document.location.href = "/score";
				}

				if (res.status >= 400) {
					updateValidation("display", true);
				}
			}
		}
	};

	return (
		<div className="p-page p-manual">
			<div className="content">
				<Input
					id="serienummer"
					label="Serienummer"
					type="text"
					disabled={!state.hasScoreboard}
					inputValue={state.serial}
					onChange={(event: React.FormEvent<HTMLInputElement>) => {
						updateState("serial", event.currentTarget.value);
					}}
				/>
				<Input
					id="scorenaam"
					label="Scoreboard Naam"
					type="text"
					disabled={!state.hasScoreboard}
					onChange={(event: React.FormEvent<HTMLInputElement>) => {
						updateState("name", event.currentTarget.value);
					}}
				/>
				{!jwt ? (
					<>
						<Input
							id="username"
							label="Gebruikersnaam"
							type="text"
							onChange={(event: React.FormEvent<HTMLInputElement>) => {
								updateState("username", event.currentTarget.value);
							}}
						/>
						<Input
							id="email"
							label="E-mail"
							type="text"
							onChange={(event: React.FormEvent<HTMLInputElement>) => {
								updateState("email", event.currentTarget.value);
							}}
						/>
						<Input
							id="password"
							label="Wachtwoord"
							type="password"
							onChange={(event: React.FormEvent<HTMLInputElement>) => {
								updateState("password", event.currentTarget.value);
							}}
						/>
						<Input
							id="confirmpassword"
							label="Bevestig wachtwoord"
							type="password"
							onChange={(event: React.FormEvent<HTMLInputElement>) => {
								updateState("confirmPassword", event.currentTarget.value);
							}}
						/>
					</>
				) : (
					<></>
				)}
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
						<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
						<polyline points="10 17 15 12 10 7"></polyline>
						<line x1="15" y1="12" x2="3" y2="12"></line>
					</svg>
				}
				label="REGISTREREN"
				color="white"
				onClick={sendRegisterRequest}
			/>
		</div>
	);
};
