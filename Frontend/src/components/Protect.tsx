import { Navigate } from "react-router-dom";

export default ({ element }: { element: any }) => {
	// console.log(`Must protect "${document.location.pathname}" 💂‍♀️!`);

	if (localStorage.getItem("Bearer")) {
		// console.log("Access granted 🔑!");
		return element;
	}

	if (document.location.origin == "http://localhost" || document.location.origin == "http://127.0.0.1") {
		return element;
	}

	console.log("Access denied 🔐!");
	return <Navigate replace to="/" />;
};
