import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Appstate from "./utils/Appstate";
import "./style/screen.scss";

import Protect from "./components/Protect";
import Root from "./pages/Root";
import Login from "./pages/Login";
import MatchSetup from "./pages/MatchSetup";
import Score from "./pages/Score";
import Templates from "./pages/Templates";
import Spectate from "./pages/Spectate";
import Scoreboard from "./pages/Scoreboard";
import Manual from "./pages/Manual";
import ChangePassword from "./pages/ChangePassword";
import Livestream from "./pages/Livestream";
import Users from "./pages/Users";
import UserSettings from "./pages/UserSettings";
import SponsorTemplates from "./pages/SponsorTemplates";
import Sponsors from "./pages/Sponsors";
import TemplateSettings from "./pages/TemplateSettings";
import AddSponsor from "./pages/AddSponsor";
import AddSponsorBundel from "./pages/AddSponsorBundel";
import Refetch from "./pages/Refetch";

export const App = () => {
	Appstate.attachUseState(...useState(Appstate.defaultState));

	const [refetch, setRefetch] = useState(false);
	Appstate.attachRefetch(refetch, setRefetch);
	const state = Appstate.getGlobalState();

	useEffect(() => {
		(async () => {
			console.log("App useEffect");
			const status = await fetch("/status");
			const json = await status.json();
			console.log(json);
			Appstate.mergeGlobalState(json);

			const templates = await fetch(`/template?serial=${encodeURI(json.serial)}`);
			const templatesJson = await templates.json();
			console.log(templatesJson);

			Appstate.updateGlobalState("templates", templatesJson);

			const sponsors = await fetch(`/sponsors?serial=${encodeURI(json.serial)}`);
			const sponsorsJson = await sponsors.json();
			console.log(sponsorsJson);

			Appstate.updateGlobalState("sponsors", sponsorsJson);
		})();
	}, [refetch]);

	return (
		<Router>
			<div className={`App ${state.color} ${state.bottomtab}`}>
				<Routes>
					<Route path="/" element={<Root />} />
					<Route path="/login" element={<Login />} />
					<Route path="/livestream" element={<Livestream />} />
					<Route path="/scoreboard" element={<Scoreboard />} />
					<Route path="/score" element={<Protect element={<Score />} />} />
					<Route path="/templates" element={<Protect element={<Templates />} />} />
					<Route path="/templatesettings" element={<Protect element={<TemplateSettings />} />} />
					<Route path="/matchsetup" element={<Protect element={<MatchSetup />} />} />
					<Route path="/manual" element={<Manual />} />
					<Route path="/spectate" element={<Spectate />} />
					<Route path="/users" element={<Protect element={<Users />} />} />
					<Route path="/usersettings" element={<Protect element={<UserSettings />} />} />
					<Route path="/sponsortemplates" element={<Protect element={<SponsorTemplates />} />} />
					<Route path="/sponsor" element={<Protect element={<Sponsors />} />} />
					<Route path="/addsponsor" element={<Protect element={<AddSponsor />} />} />
					<Route path="/addsponsorbundel" element={<Protect element={<AddSponsorBundel />} />} />
					<Route path="/changepassword" element={<Protect element={<ChangePassword />} />} />
					<Route path="/refetch" element={<Refetch />}></Route>
				</Routes>
			</div>
		</Router>
	);
};

export default App;
