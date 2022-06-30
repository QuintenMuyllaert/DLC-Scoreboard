import exp from "constants";

// H ( 0 -> 360) ; S : ( 0 -> 100 ) ; L : ( 0 -> 50 )
export const hslToHex = (h: number, s: number, l: number): string => {
	l /= 100;
	const a = (s * Math.min(l, 1 - l)) / 100;
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, "0"); // convert to Hex and prefix "0" if needed
	};
	return `#${f(0)}${f(8)}${f(4)}`;
};

export const to2digits = (n: number): string => {
	return ("0" + n).slice(-2);
};

export const clockify = (n: number): string => {
	return to2digits(Math.floor(n / 60)) + ":" + to2digits(n % 60);
};

export const delay = (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
