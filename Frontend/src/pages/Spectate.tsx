import Clock from "../components/Clock";
import Flag from "../components/Flag";
import { globalState } from "../utils/Appstate";

export const Spectate = () => {
	return (
		<>
			<div className="p-spectate">
				<Clock time={globalState.getClock()} />
				<div className="team">
					<div className="flag">
						<Flag top={globalState.hb} bottom={globalState.ho} />
					</div>
					<h1 className="teamname">{globalState.nameHome}</h1>
					<p>{globalState.t1}</p>
				</div>
				<div className="team">
					<h1 className="teamname">{globalState.nameOut}</h1>
					<p>{globalState.t2}</p>
					<div className="flag">
						<Flag top={globalState.ub} bottom={globalState.uo} />
					</div>
				</div>
			</div>
		</>
	);
};

export default Spectate;
