import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateGlobalState } from "../utils/Appstate";

export const BottomTab = () => {
	const navigate = useNavigate();

	const [admin, setAdmin] = useState(false);

	const fetchStatus = async () => {
		const res = await fetch(`/status`, { mode: "no-cors", method: "GET" });
		const json = await res.json();
		setAdmin(json.isAdmin);
	};

	useEffect(() => {
		fetchStatus();
		console.log("hello bottomtab");
		updateGlobalState("bottomtab", "withbottom-tab");

		return () => {
			console.log("woosh bottomtab");
			updateGlobalState("bottomtab", "");
		};
	}, []);

	//Navigate is faster, but doesn't check auth. (TODO: Check auth)
	//Altho no pages show bottom tabs when using is not logged in, so it should be fine.
	const goToTemplates = async () => {
		//document.location.href = "/templates";
		navigate("/templates");
	};

	const goToCurrentMatch = async () => {
		//document.location.href = "/score";
		navigate("/score");
	};

	const goToUsers = async () => {
		//document.location.href = "/users";
		if (admin) {
			navigate("/users");
		}
	};

	const goToUserSettings = async () => {
		//document.location.href = "/usersettings";
		navigate("/usersettings");
	};

	const goToSponsors = async () => {
		//document.location.href = "/usersettings";
		if (admin) {
			navigate("/sponsortemplates");
		}
	};

	return (
		<div className="c-bottomtab">
			<div
				className={
					document.location.pathname == "/templates" || document.location.pathname == "/templatesettings"
						? "c-bottomtab__page c-bottomtab__page-active"
						: "c-bottomtab__page"
				}
				onClick={goToTemplates}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="c-bottomtab__page-icon">
					<path d="M21 3H3v7h18V3z"></path>
					<path d="M21 14h-5v7h5v-7z"></path>
					<path d="M12 14H3v7h9v-7z"></path>
				</svg>
				<p className="c-bottomtab__page-name">Templates</p>
			</div>
			<div
				className={
					document.location.pathname == "/sponsortemplates" ||
					document.location.pathname == "/sponsor" ||
					document.location.pathname == "/addsponsor" ||
					document.location.pathname == "/addsponsorbundel"
						? "c-bottomtab__page c-bottomtab__page-active"
						: `c-bottomtab__page ${admin ? "" : "c-bottomtab__hidden"}`
				}
				onClick={goToSponsors}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round">
					<path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"></path>
					<path d="M2 9v1c0 1.1.9 2 2 2h1"></path>
					<path d="M16 11h0"></path>
				</svg>
				<p className="c-bottomtab__page-name">Sponsors</p>
			</div>
			<div className={document.location.pathname == "/score" ? "c-bottomtab__page c-bottomtab__page-active" : "c-bottomtab__page"} onClick={goToCurrentMatch}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="c-bottomtab__page-icon">
					<rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
					<polyline points="17 2 12 7 7 2"></polyline>
				</svg>
				<p className="c-bottomtab__page-name">Match</p>
			</div>
			<div
				className={
					document.location.pathname == "/users" ? "c-bottomtab__page c-bottomtab__page-active" : `c-bottomtab__page ${admin ? "" : "c-bottomtab__hidden"}`
				}
				onClick={goToUsers}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="c-bottomtab__page-icon">
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
					<circle cx="9" cy="7" r="4"></circle>
					<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
					<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
				</svg>
				<p className="c-bottomtab__page-name">Users</p>
			</div>
			<div
				className={document.location.pathname == "/usersettings" ? "c-bottomtab__page c-bottomtab__page-active" : "c-bottomtab__page"}
				onClick={goToUserSettings}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round">
					<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
					<circle cx="12" cy="12" r="3"></circle>
				</svg>
				<p className="c-bottomtab__page-name">Settings</p>
			</div>
		</div>
	);
};

export default BottomTab;
