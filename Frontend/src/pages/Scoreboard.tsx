import { useEffect, useState } from "react";

import Clock from "../components/Clock";
import Flag from "../components/Flag";
import Scrolltext from "../components/Scrolltext";
import Appstate from "../utils/Appstate";

export default () => {
	const state = Appstate.getState().scoreboard;
	const [sponsor, setSponsor] = useState("");

	useEffect(() => {
		let sponsorIndex = 0;
		let lastSponsor = "";

		const showNextSponsor = () => {
			sponsorIndex++;
			const state = Appstate.getState().scoreboard;
			const sponsor = state.sponsors[sponsorIndex % state.sponsors.length];
			if (lastSponsor == sponsor) {
				return;
			}

			let script = `$('#layers').empty();`;
			if (!state.display) {
				return;
			}

			if (!sponsor.includes(document.location.origin) || sponsor.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/)) {
				script += `
					var layers = [
						{
							args: {
								height: ${document.querySelector("main")?.offsetHeight || 0},
								id: "eZJKezijai",
								left: ${document.querySelector("main")?.offsetLeft || 0},
								repeatDur: "indefinite",
								src: "${sponsor}",
								top: ${document.querySelector("main")?.offsetTop || 0},
								width: ${document.querySelector("main")?.offsetWidth || 0},
							},
							changeNumber: "1.67",
							ctor: "iframe",
						}
					];	
					
					$('#layers').add( $.uncan( layers ) );	
				`;
			}

			//@ts-ignore
			document.socket.emit("eval", `(function(){${script}})();`);

			setSponsor(sponsor);
			lastSponsor = sponsor;
		};

		showNextSponsor();
		const interval = setInterval(showNextSponsor, 5000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	if (!state.display) {
		return <div className="p-scoreboard"></div>;
	}

	let layout = "ads";
	return layout === "ads" ? (
		<div className="p-scoreboard ads">
			<div className="scoreboardtop">
				<header>
					<div className={`team left ${state.isPlaying ? "" : "hide"}`}>
						<h2 className="teamscore">{state.t1}</h2>
						<Flag top={state.hb} bottom={state.ho} />
					</div>
					<div className="center">
						<Clock />
					</div>
					<div className={`team right ${state.isPlaying ? "" : "hide"}`}>
						<Flag top={state.ub} bottom={state.uo} />
						<h2 className="teamscore">{state.t2}</h2>
					</div>
				</header>
				<main className={state.fullscreen ? "fullscreen" : ""}>
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
