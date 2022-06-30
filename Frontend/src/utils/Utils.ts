import Appstate from "./Appstate";
import { LooseObject } from "./Interfaces";

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCookies = () => {
	const arrayb = document.cookie.split(";");
	const cookies: LooseObject = {};
	for (const item of arrayb) {
		const key = item.split("=")[0];
		try {
			const value = JSON.parse(item.replace(`${key}=`, ""));
			cookies[key] = value;
		} catch (err) {
			const value = item.replace(`${key}=`, "");
			cookies[key] = value;
		}
	}
	return cookies;
};

export const getQuery = () => {
	const query = window.location.search.substring(1);
	const arrayb = query.split("&");
	const querryObject: LooseObject = {};
	for (const item of arrayb) {
		const key = item.split("=")[0];
		const value = item.replace(`${key}=`, "");
		querryObject[key] = value;
	}
	return querryObject;
};

export const fetchToState = async (url: string, data: any = {}) => {
	const defaultFetch = {
		method: "GET",
		mode: "no-cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		redirect: "follow",
		referrerPolicy: "no-referrer",
	};

	const res = await fetch(url, { ...defaultFetch, ...data });
	if (res.status >= 400) {
		return false;
	}

	try {
		const json = await res.json();
		Appstate.mergeGlobalState(json);
		return json;
	} catch (err) {
		return false;
	}
};
