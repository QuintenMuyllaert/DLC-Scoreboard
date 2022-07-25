import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import Api from "../utils/Api";
import { getQuery } from "../utils/Utils";

export default () => {
	const navigate = useNavigate();

	const { serial } = getQuery();
	if (!serial) {
		consol.log("No serial? How did you get here?");
		return <Navigate replace to="/" />;
	}

	useEffect(() => {
		(async () => {
			const response = await Api.status();
			if (response.status !== 200) {
				console.log("Something went wrong");
				navigate("/login?serial=" + serial);
				return;
			}
			const data = await response.json();
			if (data.uuid) {
				navigate("/linkscoreboard?serial=" + serial);
			} else {
				navigate("/login?serial=" + serial);
			}
		})();

		return () => {};
	}, []);

	return <div></div>;
};
