import Clock from "../components/Clock";
import Flag from "../components/Flag";
import { state } from "../utils/Appstate";

export default () => {
	return (
		<>
			<div className="p-page p-spectate">
				<Clock />
				<div className="team">
					<div className="flag">
						<Flag top={state.hb} bottom={state.ho} />
					</div>
					<h1 className="teamname">{state.nameHome}</h1>
					<p>{state.t1}</p>
				</div>
				<div className="team">
					<h1 className="teamname">{state.nameOut}</h1>
					<p>{state.t2}</p>
					<div className="flag">
						<Flag top={state.ub} bottom={state.uo} />
					</div>
				</div>
			</div>
		</>
	);
};
