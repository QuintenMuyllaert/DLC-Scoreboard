import { useId } from "react";

export const Switch = ({ id, disabled, checked, onChange }: { id?: string; disabled?: boolean; onChange?: (event?: any) => any; checked?: boolean }) => {
	if (!id) {
		id = useId();
	}

	return (
		<div className="c-switch">
			<input checked={checked} disabled={disabled} id={id} type="checkbox" onChange={onChange} />
			<label htmlFor={id} className="rail">
				<div className="left"></div>
				<div className="right"></div>
				<div className="ball"></div>
			</label>
		</div>
	);
};

export default Switch;
