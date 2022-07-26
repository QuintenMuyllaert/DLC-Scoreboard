import Header from "../components/Header";
import Backarrow from "../components/Backarrow";
import Switch from "../components/Switch";
import BottomTab from "../components/BottomTab";
import Appstate from "../utils/Appstate";

export default () => {
	const { color } = Appstate.getState();
	return (
		<>
			<Header title="App Instellingen" icon={<Backarrow />} />
			<div className="p-page p-screen">
				<div>
					<p>Light/Dark</p>
					<Switch
						checked={color == "dark"}
						onChange={() => {
							localStorage.setItem("theme", color == "dark" ? "light" : "dark");
							Appstate.updateState("color", localStorage.getItem("theme") as "light" | "dark");
						}}
					/>
				</div>
			</div>
			<BottomTab />
		</>
	);
};
