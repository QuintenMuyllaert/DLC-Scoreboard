import { registerData, loginData, linkData, userdataData } from "../../../Interfaces/Interfaces";

class Api {
	url: string = document.location.origin;
	isOrigin: boolean = false;
	constructor(endpoint: string) {
		this.url = endpoint;
		this.isOrigin = this.url == document.location.origin;
		console.log("Api", this.url, this.isOrigin);
	}
	fetch(url: string, options: any) {
		const defaultOptions = {
			method: "GET",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {},
			redirect: "follow",
			referrerPolicy: "no-referrer",
		};

		if (!this.isOrigin) {
			if (!url.startsWith("/")) {
				url = `/${url}`;
			}
			url = `${this.url}${url}`;
		}

		return fetch(url, { ...defaultOptions, ...options });
	}
	register(registerData: registerData) {
		return this.fetch("register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(registerData),
		});
	}
	login(loginData: loginData) {
		return this.fetch("login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(loginData),
		});
	}
	link(linkData: linkData) {
		return this.fetch("link", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(linkData),
		});
	}
	status() {
		return this.fetch("status", {
			method: "GET",
		});
	}
	async getUserdata() {
		const res = await this.fetch("userdata", {
			method: "GET",
		});
		return await res.json();
	}
	async postUserdata(userdata: userdataData) {
		const res = await this.fetch("userdata", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userdata),
		});
		return res;
	}
}

export default new Api(document.location.origin);
