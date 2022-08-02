import { useState } from "react";

import BottomTab from "../components/BottomTab";
import Input from "../components/Input";
import Header from "../components/Header";
import Backarrow from "../components/Backarrow";

import { scoreboardInterface } from "../utils/ScoreboardInterface";
import { getQuery } from "../utils/Utils";
import { useNavigate } from "react-router-dom";

export default () => {
	const navigate = useNavigate();
	const { folder } = getQuery();

	const [sponsorName, setSponsorName] = useState("");
	const [sponsorUri, setSponsorUri] = useState("");
	const [sponsorLink, setSponsorLink] = useState("");
	const [sponsorExtention, setSponsorExtention] = useState("");
	const [disabled, setDisabled] = useState(false);

	const onClickSave = () => {
		if (sponsorName === "") {
			console.log("No name");
			return;
		}
		if (sponsorLink === "" && sponsorUri !== "" && sponsorExtention !== "") {
			console.log("No link but uri and extention");
		} else if (sponsorLink) {
			console.log("Has link");
		} else {
			console.log("No link no uri and no extention");
			return;
		}

		scoreboardInterface.emit("sponsors", {
			type: "create",
			value: {
				folder,
				file: `${sponsorName}.${sponsorLink ? "json" : sponsorExtention}`,
				uri: sponsorLink || sponsorUri,
				type: sponsorLink ? "link" : "uri",
			},
		});

		navigate(`/sponsor?folder=${encodeURIComponent(folder)}`);
	};

	return (
		<>
			<Header title="Add sponsor" icon={<Backarrow />} />
			<div className="p-page p-addSponsor">
				<div className="c-addSponsor__tekst">
					{sponsorUri ? (
						<>
							<img src={sponsorUri} alt={sponsorName} />
						</>
					) : (
						<>
							<p>
								Aanbevolen aspect ratio: <strong>16:9</strong>
							</p>
							<p>
								Aanbevolen bestandstype: <strong>PNG</strong>
							</p>
						</>
					)}
				</div>

				<div className="p-addSponsor__form">
					<Input
						label="Naam sponsor"
						type="text"
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							setSponsorName(event.currentTarget.value);
						}}
					/>
					<Input
						disabled={disabled}
						label="Link"
						type="text"
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							setSponsorLink(event.currentTarget.value);
						}}
					/>
					<input
						style={{ display: "none" }}
						type="file"
						id="file_upload"
						onChange={(event: React.FormEvent<HTMLInputElement>) => {
							const file = event?.currentTarget?.files?.[0];
							const reader = new FileReader();

							reader.addEventListener(
								"load",
								function () {
									setSponsorUri(reader.result as string);
								},
								false,
							);

							if (file) {
								setSponsorExtention(file?.name?.split(".")?.pop() || "");
								reader.readAsDataURL(file);
								setSponsorLink("");
								setDisabled(true);
							}
						}}
					/>
					<label htmlFor="file_upload" className="p-addSponsor__logo">
						<div className="p-addSponsor__logo-container">
							<p>Selecteer een logo</p>
							<div className="p-addSponsor__logo-svg">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="40"
									height="40"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round">
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
									<polyline points="17 8 12 3 7 8"></polyline>
									<line x1="12" y1="3" x2="12" y2="15"></line>
								</svg>
							</div>
						</div>
					</label>
				</div>

				<div className="p-addSponsor__btn">
					<button className="c-iconbutton white center" onClick={onClickSave}>
						Opslaan
					</button>
				</div>
			</div>
			<BottomTab />
		</>
	);
};
