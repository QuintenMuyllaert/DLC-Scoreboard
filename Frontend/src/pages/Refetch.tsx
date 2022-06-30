import { Navigate } from "react-router-dom";
import { getQuery } from "../utils/Utils";

export const Root = () => {
	const { page } = getQuery();
	return <Navigate to={`/${page || ""}`} />;
};

export default Root;
