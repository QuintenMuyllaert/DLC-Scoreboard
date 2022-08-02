import Appstate from "../utils/Appstate";
import IconButton from "./IconButton";
import Overlay from "./Overlay";

import { modalButton } from "../../../Interfaces/Interfaces";

export default () => {
	const { modal } = Appstate.getState();

	const close = () => {
		Appstate.updateState("modal", { ...modal, visible: false });
	};

	const cancelButton: modalButton = {
		text: "Cancel",
		onClick: close,
	};

	return (
		<Overlay visible={modal.visible} setVisible={close}>
			<div className="c-card c-modal">
				<h1>{modal.title}</h1>
				<p>{modal.message}</p>
				<div>
					{[cancelButton, ...modal.buttons].map((button: any, index: any) => (
						<IconButton
							color="white"
							label={button.text}
							key={index}
							onClick={async () => {
								await button.onClick();
								updateModal();
							}}
						/>
					))}
				</div>
			</div>
		</Overlay>
	);
};

export const updateModal = (title: string = "", message: string = "", buttons: modalButton[] = [], visible: boolean = false) => {
	Appstate.updateState("modal", { title, message, buttons, visible });
};
