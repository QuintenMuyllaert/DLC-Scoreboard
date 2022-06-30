//Dead code

import { useEffect } from "react";
import Logo from "../components/Logo";
import { findApi } from "../utils/Networking";
import { delay } from "../utils/Utils";

export const Search = () => {
	useEffect(() => {
		(async () => {
			const API = await findApi();
			if (!API) {
				await delay(1500);
				document.location.href = "/searcherror";
			} else {
				document.location.href = "/searchsuccess";
			}
		})();

		return () => {};
	}, []);

	return (
		<div className="p-search">
			<header>
				<div className="p-search-topbar"></div>
				<div className="p-search-iconcontainer">
					<Logo width="11rem" height="11rem" />
				</div>
			</header>
			<div className="p-search-message">
				<p>SCOREBORD ZOEKEN</p>
				<p>EVEN GEDULD</p>
				<p>. . .</p>
			</div>
		</div>
	);
};

export default Search;
