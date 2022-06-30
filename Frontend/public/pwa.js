document.addEventListener("DOMContentLoaded", init, false);

async function init() {
	if ("serviceWorker" in navigator) {
		const registrations = (await navigator.serviceWorker.getRegistrations()).length;

		navigator.serviceWorker.register("/service-worker.js").then(
			(reg) => {
				console.log("Service worker registered -->", reg);
				if (navigator.onLine) {
					reg.update();
				}
			},
			(err) => {
				console.error("Service worker not registered -->", err);
			},
		);
	}
}
