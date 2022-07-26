import { useState } from "react";
import Input from "../components/Input";
import Logo from "../components/Logo";
import IconButton from "../components/IconButton";
import { LooseObject, registerData } from "../../../Interfaces/Interfaces";
import Api from "../utils/Api";
import { getQuery } from "../utils/Utils";
import Appstate from "../utils/Appstate";
import Header from "../components/Header";
import Backarrow from "../components/Backarrow";

export default () => {
	const { serial } = getQuery();
	const queryString = serial ? "?serial=" + serial : "";

	const defaultState: LooseObject = {
		username: "",
		password: "",
		email: "",
		confirmPassword: "",
	};

	const [state, setState] = useState(defaultState);

	const updateState = (key: string, value: string) => {
		setState({ ...state, [key]: value });
	};

	const sendRegisterRequest = async () => {
		if (state.password !== state.confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		const registerData: registerData = {
			username: state.username,
			password: state.password,
			email: state.email,
		};

		const response = await Api.register(registerData);
		if (response.status !== 201) {
			console.log("Something went wrong");
			return;
		}

		const loginData: loginData = {
			email: state.email,
			password: state.password,
		};

		const response2 = await Api.login(loginData);
		if (response2.status !== 200) {
			console.log(response2.status);
			console.log("Something went wrong");
			return;
		}

		document.location.href = "/linkscoreboard" + queryString;
	};

	return (
		<>
			<Header title="Register" icon={<Backarrow />} />
			<div className="p-page p-manual">
				<div className="content">
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
		</>
	);
};
