import { ReactElement } from "React";

export const IconButton = ({ label, color, icon, onClick }: { label?: string; color: string; icon?: ReactElement; onClick?: (event?: any) => any }) => {
	if (!label) {
		label = "";
	}

	return (
		<button className={`c-iconbutton ${color} ${!icon ? "center" : ""} ${!label ? "nolabel" : ""}`} onClick={onClick ? onClick : () => {}}>
			<>{icon ? icon : <></>}</>
			{label}
		</button>
	);
};

export default IconButton;
