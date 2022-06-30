export const Input = ({
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
	return (
		<div className="c-input">
			<label htmlFor={id}>{label}</label>
			<input disabled={disabled} id={id} type={type} onChange={onChange} value={inputValue} />
		</div>
	);
};

export default Input;
