const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class InterfaceApi {
	gotRoutes: boolean = false;
	routes: any = {};
	constructor() {}
	async fetch(route: string, options?: any): Promise<any> {}
}

export class ServerLessApi {
	gotRoutes: boolean = false;
	routes: any = {};
	constructor() {
		console.log("ServerLessApi created");
		(async () => {
			console.log("Fetching routes");
			const res = await fetch("/api.json");
			this.routes = await res.json();
			this.gotRoutes = true;
			console.log("Routes", this.routes);
		})();
	}
	async fetch(route: string, options?: any) {
		while (!this.gotRoutes) {
			await delay(10);
			console.log("Waiting for routes");
		}
		const cleanRoute = route.split("?")[0];

		console.log("Requesting", cleanRoute);
		const defaults = {
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			redirect: "follow",
			referrerPolicy: "no-referrer",
			headers: {},
		};

		options = { ...defaults, ...options };

		const Bearer = localStorage.getItem("Bearer");
		if (Bearer) {
			options.headers.Authorization = `Bearer ${Bearer}`;
		}

		return fetch(this.routes[cleanRoute], options || null);
	}
}

export const Api: InterfaceApi = new ServerLessApi();
export default Api;

//@ts-ignore
document.Api = Api;
