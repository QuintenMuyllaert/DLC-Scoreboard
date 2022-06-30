import Logo from "./Logo";
import { ReactElement } from "React";

export const ToggleSponsors = ({ icon, page }: { icon?: ReactElement; page?: (event?: any) => any }) => {
	return (
		<header className="c-header">
			<button className="c-header-back" onClick={page}>
				{icon ? icon : ""}
			</button>

			<Logo width="4rem" height="4rem" />
		</header>
	);
};

export default ToggleSponsors;
