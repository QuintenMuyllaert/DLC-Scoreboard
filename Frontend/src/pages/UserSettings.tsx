import { useEffect, useRef, useState } from "react";
import { LooseObject } from "../utils/Interfaces";
import { updateGlobalState as updateState, globalState as state } from "../utils/Appstate";

import BottomTab from "../components/BottomTab";
import UserSetting from "../components/UserSetting";
import IconButton from "../components/IconButton";
import Logo from "../components/Logo";
import Header from "../components/Header";

export const UserSettings = () => {
	const refThemeSwitch = useRef<HTMLInputElement>(null);
	const defaultUser: LooseObject = {
		currentUsername: "",
		newUsername: "",
		currentPassword: "",
		newPassword: "",
		checkNewPassword: "",
	};

	const [user, setUser] = useState(defaultUser);

	const fetchStatus = async () => {
		const res = await fetch(`/status`, { mode: "no-cors", method: "GET" });
		const json = await res.json();
		updateUser("currentUsername", json.username);
	};

	useEffect(() => {
		fetchStatus();
	}, []);

	const onThemeChange = () => {
		console.log(refThemeSwitch.current?.checked);

		if (refThemeSwitch.current?.checked) {
			localStorage.setItem("theme", "dark");
			updateState("color", "dark");
		} else {
			localStorage.setItem("theme", "light");
			updateState("color", "light");
		}
	};

	const updateUser = (key: any, value: string) => {
		user[key] = value;
		setUser(user);
	};

	const sendUpdates = async () => {
		console.log(user);

		if (user.newPassword && user.newPassword == user.checkNewPassword) {
			const res = await fetch(`/changepassword`, {
				method: "PUT",
				mode: "cors",
				cache: "no-cache",
				credentials: "same-origin",
				headers: {
					"Content-Type": "application/json",
				},
				redirect: "follow",
				referrerPolicy: "no-referrer",
				body: JSON.stringify({ currentPassword: user.currentPassword, newPassword: user.newPassword }),
			});
			console.log("changed password");
		} else {
			console.log("password en bevestig password zijn niet hetzelfde!");
		}

		if (user.newUsername && user.newUsername != user.currentUsername) {
			const res = await fetch(`/edituser`, {
				method: "PUT",
				mode: "cors",
				cache: "no-cache",
				credentials: "same-origin",
				headers: {
					"Content-Type": "application/json",
				},
				redirect: "follow",
				referrerPolicy: "no-referrer",
				body: JSON.stringify({ currentUsername: user.currentUsername, newUsername: user.newUsername }),
			});

			if (res.status == 200) {
				document.location.href = "/logout";
			}
		} else {
			console.log("De nieuwe username is dezelfde als de oude username");
		}
	};

	const onLogout = () => {
		console.log("logging out");
		document.location.href = "/logout";
	};

	return (
		<>
			<div className="p-usersettings element">
				<Header
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							className="c-header__back">
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
							<polyline points="16 17 21 12 16 7"></polyline>
							<line x1="21" y1="12" x2="9" y2="12"></line>
						</svg>
					}
					page={onLogout}
				/>

				<h1>Hallo {state.username}</h1>

				<div className="content">
					<div className="item">
						<p className="title">name:</p>
						<UserSetting
							content={user.currentUsername}
							id="usernameInput"
							password={false}
							onChange={(event: React.FormEvent<HTMLInputElement>) => {
								updateUser("newUsername", event.currentTarget.value);
							}}
						/>
					</div>
					<div className="item">
						<p className="title">huidig wachtwoord:</p>
						<UserSetting
							id="currentPasswordnput"
							password={true}
							onChange={(event: React.FormEvent<HTMLInputElement>) => {
								updateUser("currentPassword", event.currentTarget.value);
							}}
						/>
					</div>
					<div className="item">
						<p className="title">nieuw wachtwoord:</p>
						<UserSetting
							id="newPasswordInput"
							password={true}
							onChange={(event: React.FormEvent<HTMLInputElement>) => {
								updateUser("newPassword", event.currentTarget.value);
							}}
						/>
					</div>
					<div className="item">
						<p className="title">bevestig nieuw wachtwoord:</p>
						<UserSetting
							id="confirmNewPasswordInput"
							password={true}
							onChange={(event: React.FormEvent<HTMLInputElement>) => {
								updateUser("checkNewPassword", event.currentTarget.value);
							}}
						/>
					</div>
				</div>
				<div className="buttons">
					<div>
						<p className="title">theme:</p>
						<label className="switch">
							<input ref={refThemeSwitch} type="checkbox" defaultChecked={state.color === "dark"} onChange={onThemeChange} />
							<span className="slider"></span>
						</label>
					</div>
					<div className="save">
						<IconButton label="OPSLAAN" color="white" onClick={sendUpdates} />
					</div>
				</div>
			</div>
			<BottomTab />
		</>
	);
};

export default UserSettings;
