import { ReactElement, useEffect, useState } from "react";

import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import Appstate from "../utils/Appstate";
import Input from "../components/Input";
import User from "../components/User";
import Header from "../components/Header";
import Backarrow from "../components/Backarrow";
import Overlay from "../components/Overlay";
import Api from "../utils/Api";

import { scoreboardInterface } from "../utils/ScoreboardInterface";
import { emailRegex, registerData } from "../../../Interfaces/Interfaces";

export default () => {
	const [addUserOverlay, setAddUserOverlay] = useState(false);
	const [existingUser, setExistingUser] = useState(false);
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");

	const { users } = Appstate.getState();

	const generatePassword = () => {
		const a = Math.random();
		const b = a.toString(36).split(".").pop();
		return b as string;
	};

	const onClickAddUser = async () => {
		if (!existingUser) {
			const password = generatePassword();
			const user: registerData = {
				email,
				username,
				password,
				isRandomPassword: true,
			};

			await Api.register(user);

			const shareData = {
				title: "DLC Scoreboard - Account",
				text: `Dag ${username}\nJe kan inloggen met deze gegevens:\nE-mail: ${email}\nWachtwoord: ${password}`,
				url: `${document.location.origin}/login`,
			};

			console.log(shareData);

			if (navigator.share) {
				await navigator.share(shareData);
			}
		}

		await Api.permission({
			serial: scoreboardInterface.getSerial(),
			type: "grant",
			value: "user",
			email,
		});

		setEmail("");
		setUsername("");
		setAddUserOverlay(false);
	};

	return (
		<>
			<Header title="User management" icon={<Backarrow />} />
			<div className="p-page p-users">
				<div className="list scrollbar">{users || []}</div>
				<div className="grid">
					<Input id="newUsername" label="Naam" type="text" onChange={(event: React.FormEvent<HTMLInputElement>) => {}} />
					<IconButton label="Toevoegen" color="white" onClick={() => setAddUserOverlay(true)} />
				</div>
			</div>
			<BottomTab />
			<Overlay visible={addUserOverlay} setVisible={setAddUserOverlay}>
				<div className="c-card">
					<h1>Gebruiker toevoegen</h1>
					<Input
						id="email"
						label="Email"
						type="email"
						inputValue={email}
						onChange={async (event: any) => {
							const email = event.target.value.toLowerCase();
							setEmail(email);

							if (emailRegex.test(email)) {
								const data = await Api.getUserdata(email);
								if (data && data.email) {
									setExistingUser(true);
									setUsername(data.username);
								} else {
									setExistingUser(false);
								}
							} else {
								setExistingUser(false);
							}
						}}
					/>
					<Input
						id="username"
						label="Username"
						type="text"
						inputValue={username}
						disabled={existingUser}
						onChange={(event: any) => setUsername(event.target.value)}
					/>
					<IconButton label="Toevoegen" color="white" onClick={onClickAddUser} />
				</div>
			</Overlay>
		</>
	);
};
