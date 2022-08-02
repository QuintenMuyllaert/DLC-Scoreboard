import { useEffect, useState } from "react";

import Api from "../utils/Api";
import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import Header from "../components/Header";
import Modal from "../components/Modal";
import Appstate from "../utils/Appstate";

export default () => {
	const [originalUsername, setOriginalUsername] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");

	const [newPassword, setNewPassword] = useState("");
	const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

	useEffect(() => {
		(async () => {
			const user = await Api.getUserdata();
			setOriginalUsername(user.username);
			setUsername(user.username);
			setEmail(user.email);
		})();

		return () => {};
	}, []);

	const onClickSave = async () => {
		Appstate.updateState("modal", {
			visible: true,
			title: "Change userdata",
			message: "Are you sure you want to change your userdata?",
			buttons: [
				{
					text: "Modify",
					onClick: async () => {
						if (newPassword !== newPasswordConfirm) {
							setNewPassword("");
							setNewPasswordConfirm("");
							return;
						}

						const res = await Api.postUserdata({
							newUsername: username,
							newEmail: email,
							newPassword,
							password,
						});
						if (res.status === 200) {
							document.location.href = "/";
						}
					},
				},
			],
		});
	};

	const onClickLogout = () => {
		Appstate.updateState("modal", {
			visible: true,
			title: "Logout",
			message: "Are you sure you want to logout?",
			buttons: [
				{
					text: "Logout",
					onClick: async () => {
						localStorage.removeItem("serial");
						document.location.href = "/logout";
					},
				},
			],
		});
	};

	return (
		<>
			<Header
				title="Usersettings"
				icon={
					<svg
						onClick={onClickLogout}
						xmlns="http://www.w3.org/2000/svg"
						height="100%"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#ffffff"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
						<polyline points="16 17 21 12 16 7"></polyline>
						<line x1="21" y1="12" x2="9" y2="12"></line>
					</svg>
				}
			/>
			<div className="p-page p-usersettings">
				<h1>Hallo {originalUsername}</h1>
				<div className="content">
					<Input label="Username" type="text" inputValue={username} onChange={(event) => setUsername(event.target.value)} />
					<Input label="Email" type="email" inputValue={email} onChange={(event) => setEmail(event.target.value)} />
					<Input label="Nieuw wachtwoord" type="password" onChange={(event) => setNewPassword(event.target.value)} />
					<Input label="Herhaal nieuw wachtwoord" type="password" onChange={(event) => setNewPasswordConfirm(event.target.value)} />
					<Input label="Wachtwoord" type="password" onChange={(event) => setPassword(event.target.value)} />
				</div>
				<IconButton label="OPSLAAN" color="white" onClick={onClickSave} />
			</div>
			<BottomTab />
			<Modal />
		</>
	);
};
