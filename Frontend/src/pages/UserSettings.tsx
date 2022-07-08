import { useRef } from "react";
import Appstate from "../utils/Appstate";

import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
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
			<div className="p-page p-usersettings element">
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
