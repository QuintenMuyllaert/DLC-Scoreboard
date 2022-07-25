import { Request, Response } from "express";

import { extractToken, jwtVerifyAsync } from "../crypto";

//protect
export default async (req: Request, res: Response, onSuccess: any = () => {}) => {
	const token = extractToken(req);
	if (!token) {
		res.status(401).send("No token");
		return false;
	}

	const { valid, body } = await jwtVerifyAsync(token);
	if (!valid) {
		res.clearCookie("bearer");
		res.clearCookie("auth");
		res.status(401).send("Invalid token");
		return false;
	}

	onSuccess(body);
};
