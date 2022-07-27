import { useState } from "react";

import Header from "../components/Header";
import Backarrow from "../components/Backarrow";
import Switch from "../components/Switch";
import BottomTab from "../components/BottomTab";
import Appstate from "../utils/Appstate";

export default () => {
	const { color } = Appstate.getState();
	const [resetCache, setResetCache] = useState(false);
	const [resetLocalStorage, setResetLocalStorage] = useState(false);
	const [resetCookies, setResetCookies] = useState(false);
	const [resetServiceWorker, setResetServiceWorker] = useState(false);

	return (
		<>
			<Header title="App Instellingen" icon={<Backarrow />} />
			<div className="p-page p-appsettings">
				<div className="setting">
					<p>Dark mode</p>
					<Switch
						checked={color == "dark"}
						onChange={() => {
							localStorage.setItem("theme", color == "dark" ? "light" : "dark");
							Appstate.updateState("color", localStorage.getItem("theme") as "light" | "dark");
						}}
					/>
				</div>
				<div className="setting">
					<p>Reset cache</p>
					<Switch
						checked={resetCache}
						onChange={async () => {
							setResetCache(true);
							await caches.delete("sw-cache");
							setTimeout(() => {
								setResetCache(false);
							}, 1000);
						}}
					/>
				</div>
				<div className="setting">
					<p>Reset local and session storage</p>
					<Switch
						checked={resetLocalStorage}
						onChange={async () => {
							setResetLocalStorage(true);
							localStorage.clear();
							sessionStorage.clear();
							setTimeout(() => {
								setResetLocalStorage(false);
							}, 1000);
						}}
					/>
				</div>
				<div className="setting">
					<p>Unregister service workers</p>
					<Switch
						checked={resetServiceWorker}
						onChange={async () => {
							setResetServiceWorker(true);

							if ("serviceWorker" in navigator) {
								navigator.serviceWorker
									.getRegistrations()
									.then(function (registrations) {
										for (let registration of registrations) {
											registration.unregister();
										}
									})
									.catch(function (err) {
										console.log("Service Worker registration failed: ", err);
									});
							}

							setTimeout(() => {
								setResetServiceWorker(false);
							}, 1000);
						}}
					/>
				</div>
				<div className="setting">
					<p>Reset cookies</p>
					<Switch
						checked={resetCookies}
						onChange={async () => {
							setResetCookies(true);
							document.cookie.split(";").forEach(function (c) {
								document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
							});
							setTimeout(() => {
								document.location.href = "/logout";
								setResetCookies(false);
							}, 1000);
						}}
					/>
				</div>
			</div>
			<BottomTab />
		</>
	);
};
