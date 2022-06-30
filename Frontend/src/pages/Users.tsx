import { ReactElement, useEffect, useState } from "react";
import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import { updateGlobalState as updateState, globalState as state } from "../utils/Appstate";

import Input from "../components/Input";
import Logo from "../components/Logo";
import User from "../components/User";
import { LooseObject } from "../utils/Interfaces";
import Header from "../components/Header";

export const Users = () => {
	const generatePassword = () => {
		const a = Math.random();
		const b = a.toString(36).split(".").pop();
		return b;
	};

	const user: LooseObject = {
		username: "",
		password: generatePassword(),
		serial: state.serial,
	};

	const validation: LooseObject = {
		message: "",
		display: false,
	};

	const [newUser, setNewUser] = useState(user);
	const [validationState, setValidation] = useState(validation);
	let userList: ReactElement[] = [];

	useEffect(() => {
		fetchUsers();
	}, []);

	const updateNewUser = (key: any, value: string) => {
		newUser[key] = value;
		setNewUser(newUser);
	};

	const updateValidation = (key: any, value: any) => {
		validation[key] = value;
		setValidation(validation);
	};

	const fetchUsers = async () => {
		const res = await fetch(`/user?serial=${state.serial}`, { mode: "no-cors", method: "GET" });
		const json = await res.json();
		//updateState("users", json);

		for (const userInList of json) {
			if (userInList.isAdmin == false) {
				userList.push(<User username={userInList.username} />);
			}
		}

		updateState("users", userList);
	};

	const handleClickNewUser = async () => {
		const p = generatePassword();
		updateNewUser("password", String(p));

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
			body: JSON.stringify(newUser),
		});

		fetchUsers();

		const message = await res.text();
		updateValidation("message", message);

		if (res.status >= 400) {
			updateValidation("display", true);
		}

		if (res.status < 400) {
			updateValidation("display", false);

			if (navigator.share) {
				navigator
					.share({
						title: "DLC Scoreboard - Account",
						text: `Log nu in met deze user:\nusername: ${newUser.username}\nwachtwoord: ${newUser.password}`,
						url: `${document.location.origin}/login`,
					})
					.then(() => console.log("Successful share"))
					.catch((error) => console.log("Error sharing", error));
			}
		}
	};

	return (
		<>
			<div className="p-users element">
				<Header />

				<h1>Mensen toevoegen</h1>
				<div className="grid">
					<Input
						id="newUsername"
						label="Naam"
						type="text"
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							updateNewUser("username", event.currentTarget.value);
						}}
					/>
					<p className={validationState.display ? "validatie" : "hidden"}>{validationState.message}</p>
				</div>
				<div className="p-users__button">
					<IconButton label="Toevoegen" color="white" onClick={handleClickNewUser} />
				</div>

				{/* <div className="userlist"> */}
				<h1 className="subtitle">Deze mensen hebben toegang</h1>
				<div className="list scrollbar">{state.users || []}</div>
				{/* </div> */}
			</div>
			<BottomTab />
		</>
	);
};

export default Users;
