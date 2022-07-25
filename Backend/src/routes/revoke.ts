import { Request, Response } from "express";

import database from "../database";
import { extractToken, jwtVerifyAsync } from "../crypto";

//revoke
export default async (req: Request, res: Response) => {
	const token = extractToken(req);
	if (token) {
		const { valid, body } = await jwtVerifyAsync(token);
		if (valid) {
			await database.delete("jwt", { username: body?.username });
		}
	}

	res.clearCookie("bearer");
	res.clearCookie("auth");
	res.redirect("/logout");
};
