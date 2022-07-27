import { registerData, loginData, linkData, userdataData, PermissionRequest } from "../../../Interfaces/Interfaces";

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
	async getUserdata(email?: string) {
		const uri = "userdata" + (email ? `?email=${email}` : "");
		const res = await this.fetch(uri, {
			method: "GET",
		});
		if (res.status === 200) {
			return await res.json();
		} else {
			return await res.text();
		}
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
	async permission(permissionRequest: PermissionRequest) {
		const res = await this.fetch("permission", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(permissionRequest),
		});
		return res;
	}
}

export default new Api(document.location.origin);
