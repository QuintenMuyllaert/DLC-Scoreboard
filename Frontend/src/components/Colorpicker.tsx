import { useState } from "react";

import Flag from "./Flag";
import IconButton from "./IconButton";
import Switch from "./Switch";
import Appstate from "../utils/Appstate";

import { scoreboardInterface } from "../utils/ScoreboardInterface";

export default ({ team, setVisible = () => {} }: { team: 1 | 2; setVisible?: (event?: any) => any }) => {
	const scoreboard = Appstate.getState().scoreboard;

	const [removing, setRemoving] = useState(false);
	const [changing, setChanging] = useState("O" as "B" | "O");
	const [color, setColor] = useState("#ff0000");

	const [newColorTop, setNewColorTop] = useState(team == 1 ? scoreboard.hb : scoreboard.ub);
	const [newColorBottom, setNewColorBottom] = useState(team == 1 ? scoreboard.ho : scoreboard.uo);

	const onClickColor = (color: string, position: "B" | "O") => {
		if (removing) {
			//remove color from scoreboard.colors
			const colors = scoreboard.colors.filter((c: string) => c != color);
			scoreboardInterface.updateColorArray(colors);
			return;
		}

		if (position == "B") {
			setNewColorTop(color);
		} else {
			setNewColorBottom(color);
		}
	};

	const onChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
		setColor(event.currentTarget.value);
	};

	const onAddColor = (event: any) => {
		const color = event.target.value as string;
		if (scoreboard.colors.includes(color)) {
			return;
		}
		scoreboardInterface.updateColorArray([...scoreboard.colors, color]);
	};

	const onClickSave = () => {
		scoreboardInterface.changeColor(`${team}B`, newColorTop);
		scoreboardInterface.changeColor(`${team}O`, newColorBottom);
		setVisible(false);
	};

	const colors = [];
	for (const color of scoreboard.colors) {
		colors.push(
			<button className="color" style={{ backgroundColor: color }} onClick={() => onClickColor(color, changing)}>
				<svg
					className={removing ? "delete-icon" : ""}
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>,
		);
	}

	return (
		<div className="c-colorpicker c-card">
			<div className="top">
				<button onClick={() => setVisible(false)}>
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
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
				<Flag top={newColorTop} bottom={newColorBottom} />
				<button onClick={() => setRemoving(!removing)}>
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
						<polyline points="3 6 5 6 21 6"></polyline>
						<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
						<line x1="10" y1="11" x2="10" y2="17"></line>
						<line x1="14" y1="11" x2="14" y2="17"></line>
					</svg>
				</button>
			</div>
			<div className="side">
				<p>Onder</p>
				<Switch
					onChange={(event) => {
						const value = event.target.checked;
						setChanging(value ? "B" : "O");
					}}
				/>
				<p>Boven</p>
			</div>
			<div className="colors">
				<>{colors}</>
				<div className="color add">
					<input onBlur={onAddColor} onChange={onChangeColor} className="o-hide" type="color" value={color} id="newColorTop" name="newColorTopName" />
					<label htmlFor="newColorTop">
						<svg
							className="icon"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<line x1="12" y1="5" x2="12" y2="19"></line>
							<line x1="5" y1="12" x2="19" y2="12"></line>
						</svg>
					</label>
				</div>
			</div>
			<IconButton color="black" label="Opslaan" onClick={onClickSave}></IconButton>
		</div>
	);
};
