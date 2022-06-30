export const Flag = ({ top, bottom, handleClickPopup }: { top: string; bottom: string; handleClickPopup?: (event?: any) => any }) => {
	return (
		<button className="c-flag" onClick={handleClickPopup ? handleClickPopup : () => {}}>
			<div className="top" style={{ backgroundColor: top }}></div>
			<div className="bottom" style={{ backgroundColor: bottom }}></div>
		</button>
	);
};

export default Flag;
