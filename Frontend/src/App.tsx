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
import Scoreboard from "./pages/Scoreboard";
import ChangePassword from "./pages/ChangePassword";
import Livestream from "./pages/Livestream";
import Users from "./pages/Users";
import UserSettings from "./pages/UserSettings";
import SponsorTemplates from "./pages/SponsorTemplates";
import Sponsors from "./pages/Sponsors";
import TemplateSettings from "./pages/TemplateSettings";
import AddSponsor from "./pages/AddSponsor";
import AddSponsorBundel from "./pages/AddSponsorBundel";
import Settings from "./pages/Settings";
import Screen from "./pages/Screen";
import Schedule from "./pages/Schedule";
import Switchscoreboard from "./pages/Switchscoreboard";
import Register from "./pages/Register";
import LinkScoreboard from "./pages/LinkScoreboard";
import QRLink from "./pages/QRLink";
import Appsettings from "./pages/Appsettings";

export const App = () => {
	Appstate.attachUseState(...useState(Appstate.defaultState));
	const state = Appstate.getState();

	useEffect(() => {
		const color = localStorage.getItem("theme");
		if (color) {
			//@ts-ignore
			Appstate.updateState("color", color);
		}

		return () => {};
	}, []);

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
					<Route path="/users" element={<Protect element={<Users />} />} />
					<Route path="/usersettings" element={<Protect element={<UserSettings />} />} />
					<Route path="/sponsortemplates" element={<Protect element={<SponsorTemplates />} />} />
					<Route path="/sponsor" element={<Protect element={<Sponsors />} />} />
					<Route path="/addsponsor" element={<Protect element={<AddSponsor />} />} />
					<Route path="/addsponsorbundel" element={<Protect element={<AddSponsorBundel />} />} />
					<Route path="/changepassword" element={<Protect element={<ChangePassword />} />} />
					<Route path="/settings" element={<Protect element={<Settings />} />} />
					<Route path="/screen" element={<Protect element={<Screen />} />} />
					<Route path="/schedule" element={<Protect element={<Schedule />} />} />
					<Route path="/switchscoreboard" element={<Protect element={<Switchscoreboard />} />} />
					<Route path="/register" element={<Register />} />
					<Route path="/linkscoreboard" element={<Protect element={<LinkScoreboard />} />} />
					<Route path="/qrlink" element={<QRLink />} />
					<Route path="/appsettings" element={<Protect element={<Appsettings />} />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
