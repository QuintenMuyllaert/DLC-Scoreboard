import { Navigate } from "react-router-dom";
import { getCookies } from "../utils/Utils";

export const Protect = ({ element }: { element: any }) => {
	const cookie = getCookies();

	// console.log(`Must protect "${document.location.pathname}" 💂‍♀️!`);

	if (cookie.auth && cookie.auth === true) {
		// console.log("Access granted 🔑!");
		return element;
	}

	if (document.location.origin == "http://localhost" || document.location.origin == "http://127.0.0.1") {
		return element;
	}

	console.log("Access denied 🔐!");
	return <Navigate replace to="/" />;
};

export default Protect;
