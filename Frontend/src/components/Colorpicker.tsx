import { useId, useRef, useLayoutEffect, useState, useEffect } from "react";
import { LooseObject } from "../utils/Interfaces";
import Color from "./Color";
import Flag from "./Flag";
import IconButton from "./IconButton";

import { updateGlobalState as updateState, globalState as state } from "../utils/Appstate";
import { scoreboardInterface } from "../utils/ScoreboardInterface";

export const Colorpicker = ({
	team,
	updateScoreState,
	active,
	handleClickPopup,
}: {
	team: 1 | 2;
	updateScoreState: Function;
	active: boolean;
	handleClickPopup?: (event?: any) => any;
}) => {
	const [focused, setFocused] = useState(false);
	const id = useId();

	const colorsB = [];
	const colorsO = [];
	for (const color of state.colors) {
		colorsB.push(<Color key={id} updateColorState={updateState} updateScoreState={updateScoreState} side={"B"} team={team} color={color} Ecolor={color} />);
		colorsO.push(<Color key={id} updateColorState={updateState} updateScoreState={updateScoreState} side={"O"} team={team} color={color} Ecolor={color} />);
	}

	let newC = "";

	useEffect(() => {
		const cb = () => {
			if (focused) {
				setFocused(false);
				if (newC && newC != "") {
					updateState("colors", [...state.colors, newC]);
					scoreboardInterface.updateColorArray(state.colors);
				}
			}
		};

		document.body.addEventListener("click", cb);

		return () => {
			document.body.removeEventListener("click", cb);
		};
	});

	const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		newC = event.target.value;
	};

	const onFocusHandler = (event: any) => {
		setTimeout(() => {
			setFocused(true);
		});
	};

	return (
		<>
			<div className={active ? "c-colorpicker__overlay" : "c-colorpicker__overlay c-colorpicker__hidden"}></div>
			<div className={active ? "c-colorpicker" : "c-colorpicker c-colorpicker__hidden"}>
				<div className="c-colorpicker__container scrollbar">
					<div className="buttons">
						<button className="close" onClick={handleClickPopup ? handleClickPopup : () => {}}>
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
						<button className="garbage" onClick={() => updateState("isRemove", !state.isRemove)}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
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
					<Flag top={team == 1 ? state.hb : state.ub} bottom={team == 1 ? state.ho : state.uo} />
					<p>Kies een kleur voor de bovenkant</p>
					<div className="c-colorpicker__colors">
						<>{colorsB}</>
						<div className="c-colorpicker__colors-colorAdd">
							<input
								onChange={changeHandler}
								onClick={(e) => {
									onFocusHandler(e);
								}}
								className="c-colorpicker__colors-colorAdd-input"
								type="color"
								id="newColorTop"
								name="newColorTopName"
							/>
							<label className="c-colorpicker__colors-colorAdd-label" htmlFor="newColorTop">
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
					<p>Kies een kleur voor de onderkant</p>
					<div className="c-colorpicker__colors">
						<>{colorsO}</>
						<div className="c-colorpicker__colors-colorAdd">
							<input
								onChange={changeHandler}
								onClick={(e) => {
									onFocusHandler(e);
								}}
								className="c-colorpicker__colors-colorAdd-input"
								type="color"
								id="newColorBottom"
								name="newColorBottomName"
							/>
							<label className="c-colorpicker__colors-colorAdd-label" htmlFor="newColorBottom">
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
					<IconButton color="black" label="Opslaan" onClick={handleClickPopup ? handleClickPopup : () => {}}></IconButton>
				</div>
			</div>
		</>
	);
};

export default Colorpicker;
