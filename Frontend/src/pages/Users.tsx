import { ReactElement, useEffect, useState } from "react";

import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import User from "../components/User";
import Header from "../components/Header";
import Backarrow from "../components/Backarrow";
import Overlay from "../components/Overlay";
import Switch from "../components/Switch";
import Api from "../utils/Api";
import Modal from "../components/Modal";

import { scoreboardInterface } from "../utils/ScoreboardInterface";
import { emailRegex, Permission, registerData, permissionList } from "../../../Interfaces/Interfaces";

export default () => {
	const [addUserOverlay, setAddUserOverlay] = useState(false);
	const [editUserOverlay, setEditUserOverlay] = useState(false);
	const [existingUser, setExistingUser] = useState(false);
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");

	const [users, setUsers] = useState([] as any[]);

	const [userPermissionData, setUserPermissionData] = useState({
		username: "",
		email: "",
		permissions: [] as Permission[],
	});

	const serial = scoreboardInterface.getSerial();

	useEffect(() => {
		(async () => {
			const users = await Api.getUsers();
			const userObjects = [];
			for (const user of users) {
				userObjects.push(
					<User
						username={user.username}
						email={user.email}
						onClickEdit={async () => {
							const res = await Api.permission({ type: "list", value: "user", email: user.email, serial });
							const permissions = (await res.json()) as unknown as Permission[];

							setUserPermissionData({
								username: user.username,
								email: user.email,
								permissions,
							});

							setEditUserOverlay(true);
						}}
					/>,
				);
			}
			setUsers(userObjects);
		})();

		return () => {};
	}, []);

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
			serial,
			type: "addUser",
			value: "user",
			email,
		});

		setEmail("");
		setUsername("");
		setAddUserOverlay(false);
		document.location.reload();
	};

	const sliders: any[] = [];
	for (const permission of permissionList) {
		sliders.push(
			<div className="setting">
				<label htmlFor={permission}>{permission}</label>
				<Switch
					id={permission}
					checked={userPermissionData.permissions.includes(permission)}
					onChange={() => {
						userPermissionData.permissions.includes(permission)
							? userPermissionData.permissions.splice(userPermissionData.permissions.indexOf(permission), 1)
							: userPermissionData.permissions.push(permission);
						setUserPermissionData({ ...userPermissionData });
					}}
				/>
			</div>,
		);
	}

	return (
		<>
			<Header title="User management" icon={<Backarrow />} />
			<div className="p-page p-users">
				<div className="list scrollbar">{users || []}</div>
				<div className="grid">
					<IconButton label="Toevoegen" color="white" onClick={() => setAddUserOverlay(true)} />
				</div>
			</div>
			<BottomTab />
			<Overlay visible={addUserOverlay} setVisible={setAddUserOverlay}>
				<div className="c-card c-useroverlay new">
					<header>
						<button className="close" onClick={() => setAddUserOverlay(false)}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
								strokeLinejoin="round">
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</button>
						<h1>Gebruiker toevoegen</h1>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"></svg>
					</header>
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
			<Overlay visible={editUserOverlay} setVisible={setEditUserOverlay}>
				<div className="c-card c-useroverlay edit">
					<header>
						<button className="close" onClick={() => setEditUserOverlay(false)}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
								strokeLinejoin="round">
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</button>
						<h1>{userPermissionData.username}</h1>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"></svg>
					</header>
					<main>{sliders}</main>
					<IconButton
						label="Opslaan"
						color="white"
						onClick={async () => {
							for (const permission of permissionList) {
								if (userPermissionData.permissions.includes(permission)) {
									await Api.permission({
										serial,
										type: "grant",
										value: permission,
										email: userPermissionData.email,
									});
								} else {
									await Api.permission({
										serial,
										type: "revoke",
										value: permission,
										email: userPermissionData.email,
									});
								}
							}
							setEditUserOverlay(false);
						}}
					/>
				</div>
			</Overlay>
			<Modal />
		</>
	);
};
