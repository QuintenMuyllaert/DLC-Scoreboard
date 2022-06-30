//Dead code

import { useEffect } from "react";
import { delay } from "../utils/Utils";

export const SearchSuccess = () => {
	useEffect(() => {
		(async () => {
			await delay(1500);
			document.location.href = "/score";
		})();

		return () => {};
	}, []);

	return (
		<div className="p-search">
			<header>
				<div className="p-search-topbar"></div>
				<div className="p-search-iconcontainer">
					<svg
						className="icon"
						xmlns="http://www.w3.org/2000/svg"
						width="11rem"
						height="11rem"
						viewBox="0 0 24 24"
						fill="none"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<polyline points="9 11 12 14 22 4"></polyline>
						<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
					</svg>
				</div>
			</header>
			<div className="p-search-message-single-line">
				<p>SCOREBORD GEVONDEN!</p>
			</div>
		</div>
	);
};

export default SearchSuccess;
