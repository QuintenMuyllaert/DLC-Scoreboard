import { useState } from "react";
import { Input } from "../components/Input";
import { Logo } from "../components/Logo";
import Header from "../components/Header";
import { IconButton } from "../components/IconButton";
import { LooseObject } from "../utils/Interfaces";

export const Manual = () => {
	const defaultState: LooseObject = {
		serial: "",
		username: "",
		password: "",
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
				const res = await fetch(`/register`, {
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
		<div className="p-manual">
			<Header />
			<div className="content">
				<div className="u-grid-vertical-gap">
					<p className={validationState.display ? "validatie" : "hidden"}>{validationState.message}</p>
					<Input
						id="serienummer"
						label="serienummer"
						type="text"
						disabled={!state.hasScoreboard}
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							updateState("serial", event.currentTarget.value);
						}}
					/>
					<Input
						id="username"
						label="username"
						type="text"
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							updateState("username", event.currentTarget.value);
						}}
					/>
					<Input
						id="password"
						label="wachtwoord"
						type="password"
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							updateState("password", event.currentTarget.value);
						}}
					/>
					<Input
						id="confirmpassword"
						label="bevestig wachtwoord"
						type="password"
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							updateState("confirmPassword", event.currentTarget.value);
						}}
					/>
					<div className="c-checkbox">
						<input type="checkbox" id="noScoreboaard" name="noScoreboaard" value="no" onClick={onCheck} />
						<label htmlFor="saveTemplate">Ik heb geen scorebord</label>
					</div>
				</div>
				<div className="button">
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
			</div>
		</div>
	);
};

export default Manual;
