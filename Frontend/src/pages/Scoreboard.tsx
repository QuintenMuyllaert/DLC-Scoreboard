import Clock from "../components/Clock";
import Flag from "../components/Flag";
import Scrolltext from "../components/Scrolltext";
import { globalState } from "../utils/Appstate";

import { CSSProperties } from "react";
import { Fireworks, useFireworks } from "fireworks-js/dist/react";

export const Scoreboard = () => {
	const { enabled, options, setEnabled, setOptions } = useFireworks({
		initialStart: true,
		initialOptions: {
			hue: {
				min: 0,
				max: 0,
			},
			delay: {
				min: 20,
				max: 50,
			},
			acceleration: 1.2,
			friction: 0.96,
			gravity: 1,
			particles: 50,
			trace: 3,
			explosion: 6,
			autoresize: true,
			brightness: {
				min: 1,
				max: 50,
				decay: {
					min: 0.015,
					max: 0.03,
				},
			},
			boundaries: {
				visible: false,
			},
		},
	});

	const style: CSSProperties = {
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		position: "fixed",
		background: "#00000000",
	};

	if (enabled) {
		setEnabled(false);
	}

	return (
		<div className="p-scoreboard">
			<Fireworks style={style} options={options} enabled={enabled} />
			<div className="scoreboardtop">
				<header>
					<div className="team">
						<div className="flag">
							<Flag top={globalState.hb} bottom={globalState.ho} />
						</div>
					</div>
					<Clock time={globalState.getClock()} />
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
