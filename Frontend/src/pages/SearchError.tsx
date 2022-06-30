//Dead code

import { IconButton } from "../components/IconButton";

export const SearchError = () => {
	return (
		<div className="p-search">
			<header>
				<div className="p-search-topbar"></div>
				<div className="p-search-iconcontainer">
					<svg
						className="icon"
						xmlns="http://www.w3.org/2000/svg"
						width="11rem"
						height="11rem"
						viewBox="0 0 24 24"
						fill="none"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
						<line x1="15" y1="9" x2="9" y2="15"></line>
						<line x1="9" y1="9" x2="15" y2="15"></line>
					</svg>
				</div>
			</header>
			<div className="p-search-message">
				<p>FOUT</p>
				<p>GEEN SCOREBORD GEVONDEN!</p>
				<p>CONTROLEER UW NETWERK</p>
			</div>
			<div className="p-search-retry">
				<IconButton
					icon={
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
							<path d="M21 2v6h-6"></path>
							<path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
							<path d="M3 22v-6h6"></path>
							<path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
						</svg>
					}
					label="HERPROBEER"
					color="white"
					onClick={() => {
						document.location.href = "/search";
					}}
				/>
				<IconButton
					icon={
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
							<path d="M21 2v6h-6"></path>
							<path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
							<path d="M3 22v-6h6"></path>
							<path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
						</svg>
					}
					label="MANUEEL"
					color="white"
					onClick={() => {
						//TODO : Add manual ip config
						document.location.href = "/manual";
					}}
				/>
			</div>
		</div>
	);
};

export default SearchError;
