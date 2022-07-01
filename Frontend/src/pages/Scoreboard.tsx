import Clock from "../components/Clock";
import Flag from "../components/Flag";
import Scrolltext from "../components/Scrolltext";
import { state } from "../utils/Appstate";

export const Scoreboard = () => {
	return (
		<div className="p-scoreboard">
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
