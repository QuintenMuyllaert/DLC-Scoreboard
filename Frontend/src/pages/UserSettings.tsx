import { useRef } from "react";
import Appstate from "../utils/Appstate";

import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import Header from "../components/Header";
import Input from "../components/Input";

export const UserSettings = () => {
	const { color, jwt } = Appstate.getState();

	const refThemeSwitch = useRef<HTMLInputElement>(null);

	const onChangeTheme = () => {
		console.log(refThemeSwitch.current?.checked);

		if (refThemeSwitch.current?.checked) {
			localStorage.setItem("theme", "dark");
			Appstate.updateState("color", "dark");
		} else {
			localStorage.setItem("theme", "light");
			Appstate.updateState("color", "light");
		}
	};

	const onClickSave = () => {};

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

				<h1>Hallo {jwt?.username}</h1>

				<div className="content">
					<Input label="Naam" type="text" />
					<Input label="Huidig wachtwoord" type="password" />
					<Input label="Nieuw wachtwoord" type="password" />
					<Input label="Herhaal nieuw wachtwoord" type="password" />
				</div>
				<div className="buttons">
					<div>
						<p className="title">theme:</p>
						<label className="switch">
							<input ref={refThemeSwitch} type="checkbox" defaultChecked={color === "dark"} onChange={onChangeTheme} />
							<span className="slider"></span>
						</label>
					</div>
					<div className="save">
						<IconButton label="OPSLAAN" color="white" onClick={onClickSave} />
					</div>
				</div>
			</div>
			<BottomTab />
		</>
	);
};

export default UserSettings;
