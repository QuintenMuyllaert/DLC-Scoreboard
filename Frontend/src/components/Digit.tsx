import { IconButton } from "./IconButton";

interface params {
	value: number;
	style?: "+-" | "^v";
	onClickUp?: (event?: any) => any;
	onClickDown?: (event?: any) => any;
}

export const Digit = ({ value, style, onClickUp, onClickDown }: params) => {
	style = style || "^v";

	return style == "^v" ? (
		<div className="c-digit t-rocker">
			<IconButton
				color="white"
				icon={
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="70"
						height="70"
						viewBox="0 0 24 24"
						fill="none"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<polyline points="18 15 12 9 6 15"></polyline>
					</svg>
				}
				onClick={onClickUp}
			/>
			<p className="teamscore">{value}</p>
			<IconButton
				color="white"
				icon={
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="70"
						height="70"
						viewBox="0 0 24 24"
						fill="none"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				}
				onClick={onClickDown}
			/>
		</div>
	) : (
		<div className="c-digit">
			<p className="teamscore">{value}</p>
			<div className="controlpanel">
				<button onClick={onClickDown}>-</button>
				<button onClick={onClickUp}>+</button>
			</div>
		</div>
	);
};

export default Digit;
