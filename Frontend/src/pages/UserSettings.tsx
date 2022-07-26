import { useEffect, useState } from "react";

import Api from "../utils/Api";
import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import Header from "../components/Header";

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
	};

	return (
		<>
			<Header title="Usersettings" />
			<div className="p-page p-usersettings">
				<h1>Hallo {originalUsername}</h1>
				<div className="content">
					<Input label="Username" type="text" inputValue={username} onChange={(event) => setUsername(event.target.value)} />
					<Input label="Email" type="text" inputValue={email} onChange={(event) => setEmail(event.target.value)} />
					<Input label="Nieuw wachtwoord" type="password" onChange={(event) => setNewPassword(event.target.value)} />
					<Input label="Herhaal nieuw wachtwoord" type="password" onChange={(event) => setNewPasswordConfirm(event.target.value)} />
					<Input label="Wachtwoord" type="password" onChange={(event) => setPassword(event.target.value)} />
				</div>
				<IconButton label="OPSLAAN" color="white" onClick={onClickSave} />
			</div>
			<BottomTab />
		</>
	);
};
