import Appstate from "../utils/Appstate";

import BottomTab from "../components/BottomTab";
import IconButton from "../components/IconButton";
import Input from "../components/Input";

export default () => {
	const { jwt } = Appstate.getState();

	const onClickSave = () => {};

	return (
		<>
			<div className="p-page p-usersettings">
				<h1>Hallo {jwt?.username}</h1>
				<div className="content">
					<Input label="Naam" type="text" />
					<Input label="Huidig wachtwoord" type="password" />
					<Input label="Nieuw wachtwoord" type="password" />
					<Input label="Herhaal nieuw wachtwoord" type="password" />
				</div>
				<div className="buttons">
					<IconButton label="OPSLAAN" color="white" onClick={onClickSave} />
				</div>
			</div>
			<BottomTab />
		</>
	);
};
