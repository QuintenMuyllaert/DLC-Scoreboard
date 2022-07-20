import Logo from "./Logo";

export default ({ title, onClick }: { title: string; onClick?: (event?: any) => any }) => {
	return (
		<nav className="c-header">
			<div></div>
			<h1>{title}</h1>
			<Logo width="auto" height="100%" />
		</nav>
	);
};
