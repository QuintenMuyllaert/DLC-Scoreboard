import Clock from "../components/Clock";
import Flag from "../components/Flag";
import Scrolltext from "../components/Scrolltext";
import { globalState } from "../utils/Appstate";

export const Scoreboard = () => {
	return (
		<div className="p-scoreboard">
			<div className="scoreboardtop">
				<header>
					<div className="team">
						<div className="flag">
							<Flag top={globalState.hb} bottom={globalState.ho} />
						</div>
					</div>
					<Clock />
					<div className="team">
						<div className="flag">
							<Flag top={globalState.ub} bottom={globalState.uo} />
						</div>
					</div>
				</header>
				<section>
					<h1 className="teamname">{globalState.nameHome}</h1>
					<h3 style={{ opacity: 0 }}>-</h3>
					<h1 className="teamname">{globalState.nameOut}</h1>
				</section>
				<main>
					<h2 className="teamscore">{globalState.t1}</h2>
					<h2 className="teamscore">{globalState.t2}</h2>
				</main>
			</div>
			<footer>
				<Scrolltext text={globalState.message} />
			</footer>
		</div>
	);
};

export default Scoreboard;
