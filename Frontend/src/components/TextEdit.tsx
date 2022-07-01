import { useState } from "react";
import { IconButton } from "./IconButton";
import { scoreboardInterface } from "../utils/ScoreboardInterface";
import Appstate from "../utils/Appstate";

export const TextEdit = ({ setVisible = () => {} }: { setVisible?: (event?: any) => any }) => {
	const [message, setMessage] = useState(Appstate.getState().scoreboard.message);

	const onTextUpdate = (event: any) => {
		setMessage(event.target.value);
	};

	return (
		<div className="c-textedit__container">
			<div className="c-textedit__header">
				<p>Type hier je bericht:</p>
				<div className="c-textedit__header-btn">
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
				</div>
			</div>
			<div className="c-textedit__textarea">
				<label htmlFor="scrolltext">Tekst</label>
				<textarea value={message} name="scrolltext" id="scrolltext" onChange={onTextUpdate}></textarea>
			</div>

			<IconButton
				color="black"
				label="Send message"
				onClick={() => {
					scoreboardInterface.sendMessage(message);
					setVisible(false);
				}}></IconButton>
		</div>
	);
};

export default TextEdit;
