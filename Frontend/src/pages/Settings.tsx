import { useNavigate } from "react-router-dom";

import IconButton from "../components/IconButton";
import BottomTab from "../components/BottomTab";

import { scoreboardInterface } from "../utils/ScoreboardInterface";
import Appstate from "../utils/Appstate";
import Header from "../components/Header";

export default () => {
	const navigate = useNavigate();

	const onClickLogout = () => {
		document.location.href = "/logout";
	};

	return (
		<>
			<Header
				title="Settings"
				icon={
					<button class="c-svgbutton" onClick={onClickLogout}>
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
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
							<polyline points="16 17 21 12 16 7"></polyline>
							<line x1="21" y1="12" x2="9" y2="12"></line>
						</svg>
					</button>
				}
			/>
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
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round">
								<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
								<circle cx="12" cy="7" r="4"></circle>
							</svg>
						}
					/>
					<IconButton
						color="white"
						label="Templates"
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
						label="Schedules"
						onClick={() => navigate("/schedule")}
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
								<path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"></path>
								<path d="M16 2v4"></path>
								<path d="M8 2v4"></path>
								<path d="M3 10h5"></path>
								<path d="M17.5 17.5 16 16.25V14"></path>
								<path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"></path>
							</svg>
						}
					/>
					<IconButton
						color="white"
						label="Sponsors"
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
						label="Gebruikers"
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
					<IconButton
						color="white"
						label="Scoreboards"
						onClick={() => navigate("/switchscoreboard")}
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
								<rect x="9" y="2" width="6" height="6"></rect>
								<rect x="16" y="16" width="6" height="6"></rect>
								<rect x="2" y="16" width="6" height="6"></rect>
								<path d="M5 16v-4h14v4"></path>
								<path d="M12 12V8"></path>
							</svg>
						}
					/>
				</main>
			</div>

			<BottomTab />
		</>
	);
};
