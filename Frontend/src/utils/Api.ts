const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class InterfaceApi {
	gotRoutes: boolean = false;
	routes: any = {};
	constructor() {}
	async fetch(route: string, options?: any): Promise<any> {}
	async login(username: string, password: string): Promise<any> {}
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
			redirect: "follow",
			referrerPolicy: "no-referrer",
			headers: {},
		};

		options = { ...defaults, ...options };

		const Bearer = localStorage.getItem("Bearer");
		if (Bearer) {
			options.headers.Authorization = `Bearer ${Bearer}`;
		}

		console.log(this.routes[cleanRoute], options);

		return fetch(this.routes[cleanRoute], options);
	}
	async login(username: string, password: string): Promise<any> {
		const res = await this.fetch("auth", {
			method: "POST",
			body: JSON.stringify({ username, password }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const body = await res.json();
		if (body.token) {
			localStorage.setItem("Bearer", body.token);
		}

		return body;
	}
}

export const Api: InterfaceApi = new ServerLessApi();
export default Api;

//@ts-ignore
document.Api = Api;
