import { delay } from "./Utils";
export const findLocalIp = async (ipv4Only: boolean = true) => {
	let ips: string[] = await new Promise((resolve, reject) => {
		if (typeof window.RTCPeerConnection == "undefined") {
			return resolve([]);
		}

		let pc = new RTCPeerConnection();
		let ips: string[] = [];

		pc.createDataChannel("");
		pc.createOffer()
			.then((offer) => pc.setLocalDescription(offer))
			.catch((err) => resolve([]));
		pc.onicecandidate = (event) => {
			if (!event || !event.candidate) {
				// All ICE candidates have been sent.
				if (ips.length == 0) {
					return resolve([]);
				}

				return resolve(ips);
			}

			let parts = event.candidate.candidate.split(" ");
			let [base, componentId, protocol, priority, ip, port, , type, ...attr] = parts;

			if (!ips.some((e) => e == ip)) {
				if (!ipv4Only || ip.match(/^[0-9]+.[0-9]+.[0-9]+.[0-9]+$/g)) {
					ips.push(ip);
				}
			}
		};
	});

	try {
		return await ips;
	} catch (err) {
		return [];
	}
};

export const ping = async (uri: string, log: boolean = false) => {
	if (log) {
		console.log("trigger @", uri);
	}

	try {
		await fetch(uri, { mode: "no-cors" });
		return uri;
	} catch (err) {
		await delay(10000);
		return false;
	}
};

export const trigger = (uri: string) => {
	ping(uri, true);
};

export let cachedApi: string | boolean | null = null;

export const findApi = async (allowCache: boolean = false) => {
	if (allowCache && cachedApi !== null) {
		return cachedApi;
	}

	const ips = await findLocalIp();
	console.log("LOCAL IP : ", ips);
	if (!ips.length) {
		console.error("Couldn't find local IP, API detection not possible.");
		return false;
	}

	let pings = [];
	for (const ip of ips) {
		const subnet = ip.split(".").slice(0, 3).join(".");
		for (let i = 1; i < 255 - 1; i++) {
			pings.push(ping(`http://${subnet}.${i}:1234`));
		}
	}

	/*const apis = await Promise.all(pings);
	console.log(apis);
	const api = apis.shift();*/
	const api = await Promise.race(pings);
	console.log("REMOTE IP : ", api);
	cachedApi = api;
	return api;
};

/*
//Mixed content bypass attempt : doesn't work on mobile 
export const trigger = async (uri: string) => {
	return await new Promise((resolve, reject) => {
		let img = document.createElement("img");
		img.onload = (err) => {
			resolve(uri);
		};
		img.onerror = async (err) => {
			resolve(uri);
		};
		img.src = uri;
		setTimeout(() => {
			resolve(false);
		}, 10 * 1000);
	});
};

export const ping = trigger;
*/
