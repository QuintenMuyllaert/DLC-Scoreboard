export default ({ imgUrl, onClick }: { imgUrl: string; onClick: () => any }) => {
	const img = imgUrl.split("/").pop()?.split(".")[0];
	return (
		<article className="p-sponsors__list-item">
			<div className="p-sponsors__list-img">
				<img src={imgUrl} alt={img} />
			</div>
			<p>{img}</p>
			<button className="p-sponsors__list-btn" onClick={onClick}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="30"
					height="30"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round">
					<polyline points="3 6 5 6 21 6"></polyline>
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
					<line x1="10" y1="11" x2="10" y2="17"></line>
					<line x1="14" y1="11" x2="14" y2="17"></line>
				</svg>
			</button>
		</article>
	);
};
