export const Flag = ({ top, bottom, onClick = () => {} }: { top: string; bottom: string; onClick?: (event?: any) => any }) => {
	return (
		<button className="c-flag" onClick={onClick}>
			<div className="top" style={{ backgroundColor: top }}></div>
			<div className="bottom" style={{ backgroundColor: bottom }}></div>
		</button>
	);
};

export default Flag;
