export const ModalConfirm = ({
	active,
	tekst,
	handleClickDeletePopup,
	handleDelete,
}: {
	active: boolean;
	tekst: string;
	handleClickDeletePopup?: (event?: any) => any;
	handleDelete?: (event?: any) => any;
}) => {
	return (
		<>
			<div className={active ? "c-modal__overlay" : "c-modal__overlay c-modal__hidden"}></div>
			<div className={active ? "c-modal" : "c-modal c-modal__hidden"}>
				<div className="c-modal__container">
					<div className="c-modal__header">
						<div className="c-modal__header-btn">
							<button onClick={handleClickDeletePopup}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round">
									<line x1="18" y1="6" x2="6" y2="18"></line>
									<line x1="6" y1="6" x2="18" y2="18"></line>
								</svg>
							</button>
						</div>
					</div>
					<p>{tekst}</p>
					<div className="c-modal__btns">
						<button className="c-modal__btns-btn c-modal__btns-sec" onClick={handleClickDeletePopup}>
							Nee
						</button>
						<button className="c-modal__btns-btn c-modal__btns-prim" onClick={handleDelete}>
							Ja
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default ModalConfirm;
