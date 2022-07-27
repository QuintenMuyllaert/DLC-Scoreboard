import { useState, useEffect } from "react";

import Input from "../components/Input";
import IconButton from "../components/IconButton";
import Api from "../utils/Api";

import { getQuery } from "../utils/Utils";

export default () => {
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");

	const { password } = getQuery();

	useEffect(() => {
		(async () => {
			const user = await Api.getUserdata();
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

		if (!newPassword) {
			return;
		}

		const res = await Api.postUserdata({
			newUsername: "",
			newEmail: "",
			newPassword,
			password,
		});

		const res2 = await Api.login({
			email,
			password: newPassword,
		});

		document.location.href = "/";
	};

	return (
		<div className="p-page p-manual">
			<div className="content">
				<div className="u-grid-vertical-gap">
					<div className="text">
						<h1>Welkom {username}!</h1>
						<p>Kies hier je nieuwe wachtwoord</p>
					</div>

					<Input
						id="password"
						label="wachtwoord"
						type="password"
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							setNewPassword(event.currentTarget.value);
						}}
					/>
					<Input
						id="confpassword"
						label="bevestig wachtwoord"
						type="password"
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							setNewPasswordConfirm(event.currentTarget.value);
						}}
					/>
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
						label="BEVESTIGEN"
						color="white"
						onClick={onClickSave}
					/>
				</div>
			</div>
		</div>
	);
};
