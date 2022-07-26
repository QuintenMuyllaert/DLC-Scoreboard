import Logo from "./Logo";

export default ({ title, icon = <div></div>, onClick }: { title: string; icon?: any; onClick?: (event?: any) => any }) => {
	return (
		<nav className="c-header">
			{icon}
			<h1>{title}</h1>
			<Logo height="100%" />
		</nav>
	);
};
