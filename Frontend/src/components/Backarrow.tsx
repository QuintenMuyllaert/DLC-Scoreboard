import { useNavigate } from "react-router-dom";

export default () => {
	const navigate = useNavigate();
	const onClick = () => {
		navigate(-1);
	};

	return (
		<svg
			onClick={onClick}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			height="100%"
			fill="none"
			stroke="#ffffff"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round">
			<line x1="19" y1="12" x2="5" y2="12"></line>
			<polyline points="12 19 5 12 12 5"></polyline>
		</svg>
	);
};
