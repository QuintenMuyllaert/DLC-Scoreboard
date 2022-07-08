import { useNavigate } from "react-router-dom";

import IconButton from "../components/IconButton";
import BottomTab from "../components/BottomTab";

import { scoreboardInterface } from "../utils/ScoreboardInterface";
import Appstate from "../utils/Appstate";

export const Settings = () => {
	const navigate = useNavigate();
	return (
		<>
			<div className="p-page p-settings">
				<main>
					<IconButton
						color="white"
						label="Account"
						onClick={() => navigate("/usersettings")}
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
								strokeLinejoin="round"
								className="c-bottomtab__page-icon">
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
								<circle cx="9" cy="7" r="4"></circle>
								<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
								<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
							</svg>
						}
					/>
					<IconButton
						color="white"
						label="Beheer Templates"
						onClick={() => navigate("/templates")}
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
								strokeLinejoin="round"
								className="c-bottomtab__page-icon">
								<path d="M21 3H3v7h18V3z"></path>
								<path d="M21 14h-5v7h5v-7z"></path>
								<path d="M12 14H3v7h9v-7z"></path>
							</svg>
						}
					/>
					<IconButton
						color="white"
						label="Beheer Sponsors"
						onClick={() => navigate("/sponsortemplates")}
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
								stroke-linejoin="round">
								<path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"></path>
								<path d="M2 9v1c0 1.1.9 2 2 2h1"></path>
								<path d="M16 11h0"></path>
							</svg>
						}
					/>
					<IconButton
						color="white"
						label="Beheer Gebruikers"
						onClick={() => navigate("/users")}
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
								strokeLinejoin="round"
								className="c-bottomtab__page-icon">
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
								<circle cx="9" cy="7" r="4"></circle>
								<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
								<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
							</svg>
						}
					/>
				</main>
			</div>

			<BottomTab />
		</>
	);
};

export default Settings;
