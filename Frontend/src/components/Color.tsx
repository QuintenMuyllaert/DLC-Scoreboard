import { scoreboardInterface } from "../utils/ScoreboardInterface";
import { updateGlobalState as updateState, globalState as state } from "../utils/Appstate";

export const Color = ({
	color,
	Ecolor,
	team,
	side,
	updateColorState,
	updateScoreState,
	onClick,
}: {
	color: string;
	Ecolor: string;
	team: 1 | 2;
	side: "B" | "O";
	updateColorState: Function;
	updateScoreState: Function;
	onClick?: (event?: any) => any;
}) => {
	const SetValue = (team: number, side: string) => {
		switch (team.toString() + side) {
			case "1B":
				return "hb";
			case "1O":
				return "ho";
			case "2B":
				return "ub";
			case "2O":
				return "uo";
		}
	};

	return (
		<div
			className="c-colorpicker__colors-color"
			style={{ backgroundColor: Ecolor }}
			onClick={
				//somethings not right here.
				onClick
					? onClick
					: () => {
							if (state.isRemove) {
								let index = state.colors.indexOf(color);
								let newColorArray: string[] = state.colors;
								newColorArray.splice(index, 1);
								updateState("colors", newColorArray);
								scoreboardInterface.updateColorArray(state.colors);
								updateState("colors", state.colors);
								console.log(state.colors);
							} else {
								scoreboardInterface.changeColor(`${team}${side}`, Ecolor);
							}

							updateColorState(SetValue(team, side), Ecolor);
							updateScoreState(SetValue(team, side), Ecolor);
					  }
			}>
			<svg
				// className="delete-icon"
				className={state.isRemove ? "delete-icon" : ""}
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round">
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</div>
	);
};

export default Color;
