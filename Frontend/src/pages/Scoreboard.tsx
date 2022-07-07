import { useEffect, useState } from "react";

import Clock from "../components/Clock";
import Flag from "../components/Flag";
import Scrolltext from "../components/Scrolltext";
import Appstate from "../utils/Appstate";

export const Scoreboard = () => {
	const state = Appstate.getState().scoreboard;
	const [sponsor, setSponsor] = useState("");

	useEffect(() => {
		let sponsorIndex = 0;

		const interval = setInterval(() => {
			sponsorIndex++;
			const state = Appstate.getState().scoreboard;
			const sponsor = state.sponsors[sponsorIndex % state.sponsors.length];
			setSponsor(sponsor);
		}, 5000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	let layout = "ads";
	return layout === "ads" ? (
		<div className="p-scoreboard ads">
			<div className="scoreboardtop">
				<header>
					<div className="team left">
						<h2 className="teamscore">{state.t1}</h2>
						<Flag top={state.hb} bottom={state.ho} />
					</div>
					<Clock />
					<div className="team right">
						<Flag top={state.ub} bottom={state.uo} />
						<h2 className="teamscore">{state.t2}</h2>
					</div>
				</header>
				<main>
					<picture>
						<img src={sponsor} alt="" />
					</picture>
				</main>
			</div>
			<footer>
				<Scrolltext text={state.message} />
			</footer>
		</div>
	) : (
		<div className="p-scoreboard noads">
			<div className="scoreboardtop">
				<header>
					<div className="team">
						<div className="flag">
							<Flag top={state.hb} bottom={state.ho} />
						</div>
					</div>
					<Clock />
					<div className="team">
						<div className="flag">
							<Flag top={state.ub} bottom={state.uo} />
						</div>
					</div>
				</header>
				<section>
					<h1 className="teamname">{state.nameHome}</h1>
					<h3 style={{ opacity: 0 }}>-</h3>
					<h1 className="teamname">{state.nameOut}</h1>
				</section>
				<main>
					<h2 className="teamscore">{state.t1}</h2>
					<h2 className="teamscore">{state.t2}</h2>
				</main>
			</div>
			<footer>
				<Scrolltext text={state.message} />
			</footer>
		</div>
	);
};

export default Scoreboard;
