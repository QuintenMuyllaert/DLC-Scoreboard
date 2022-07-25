import { registerData } from "../../Interfaces/Interfaces";

class Api {
	url: string = document.location.origin;
	constructor(endpoint: string) {
		this.url = endpoint;
		this.isOrigin = this.url == document.location.origin;
		console.log("Api", this.url, this.isOrigin);
	}
	fetch(url: string, options: any) {
		const defaultOptions = {
			method: "GET",
			mode: "no-cors",
			cache: "no-cache",
			redirect: "follow",
			referrerPolicy: "no-referrer",
		};

		if (!this.isOrigin) {
			if (!url.startsWith("/")) {
				url = `/${url}`;
			}
			url = `${this.url}${url}`;
		}

		console.log(url, { ...defaultOptions, ...options });

		return fetch(url, { ...defaultOptions, ...options });
	}
	register(registerData: registerData) {
		return this.fetch("register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
			},
			body: JSON.stringify(registerData),
		});
	}
	login(loginData: loginData) {
		return this.fetch("auth", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(loginData),
		});
	}
}

export default new Api(document.location.origin);
