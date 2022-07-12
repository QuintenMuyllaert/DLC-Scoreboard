import { useId } from "react";

export default ({
	label,
	type,
	id,
	disabled,
	onChange,
	inputValue,
}: {
	label: string;
	type?: string;
	id?: string;
	disabled?: boolean;
	onChange?: (event?: any) => any;
	inputValue?: any;
}) => {
	if (!id) {
		id = useId();
	}

	return (
		<div className="c-input">
			<input disabled={disabled} id={id} type={type} onChange={onChange} value={inputValue} />
			<label htmlFor={id}>{label}</label>
		</div>
	);
};
