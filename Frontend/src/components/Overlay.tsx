export default ({ visible, setVisible = () => {}, children }: { visible: boolean; setVisible?: (event?: any) => any; children?: any }) => {
	if (visible) {
		return (
			<div className="c-overlay">
				<div className="c-overlay-x" onClick={() => setVisible(false)}></div>
				<div className="c-overlay-content"> {children}</div>
			</div>
		);
	} else {
		return <></>;
	}
};
