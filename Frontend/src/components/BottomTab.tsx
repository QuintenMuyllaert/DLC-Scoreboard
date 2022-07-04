import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Appstate from "../utils/Appstate";

export const BottomTabItem = ({ name, path, svg }: { name: string; path: string; svg: any }) => {
	const navigate = useNavigate();
	return (
		<div className={document.location.pathname == path ? "c-bottomtab__page c-bottomtab__page-active" : "c-bottomtab__page"} onClick={() => navigate(path)}>
			<>{svg}</>
			<p className="c-bottomtab__page-name">{name}</p>
		</div>
	);
};

export const BottomTab = () => {
	useEffect(() => {
		console.log("hello bottomtab");
		Appstate.updateState("bottomtab", "withbottom-tab");

		return () => {
			console.log("woosh bottomtab");
			Appstate.updateState("bottomtab", "");
		};
	}, []);

	return (
		<div className="c-bottomtab">
			<BottomTabItem
				name="Match"
				path="/screen"
				svg={
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
						<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
						<line x1="8" y1="21" x2="16" y2="21"></line>
						<line x1="12" y1="17" x2="12" y2="21"></line>
					</svg>
				}
			/>
			<BottomTabItem
				name="Match"
				path="/score"
				svg={
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
				}
			/>
			<BottomTabItem
				name="Settings"
				path="/settings"
				svg={
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
				}
			/>
		</div>
	);
};

export default BottomTab;
