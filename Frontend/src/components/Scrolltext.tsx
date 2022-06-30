export const Scrolltext = ({ text }: { text: string }) => {
	return (
		<div className="c-scroll">
			<div style={{ animationDuration: `${Math.max(0.25 * text.length, 4)}s` }} className="scrollcontainer">
				<h1>&#10240;{text}&#x2800;</h1>
			</div>
			<h1 style={{ opacity: 0 }}>&#10240;{text}&#x2800;</h1>
		</div>
	);
};

export default Scrolltext;
