import { Request, Response } from "express";

import protect from "../utils/protect";
import database from "../database";

import { validateHash, hash } from "../crypto";
import { LooseObject } from "../../../Interfaces/Interfaces";

//changepassword
export default async (req: Request, res: Response) => {
	await protect(req, res, async (body: LooseObject) => {
		const { username } = body;
		const { currentPassword, newPassword } = req.body;
		if (!username || !currentPassword || !newPassword) {
			res.status(400).send("Missing username or password");
			return;
		}
		const [userdata] = await database.read("accounts", { username });
		if (!userdata) {
			res.status(401).send("User does not exist");
			return;
		}
		const valid = await validateHash(currentPassword, userdata?.password);
		if (!valid) {
			res.status(401).send("Invalid password");
			return;
		}
		await database.update("accounts", { username }, { ...userdata, password: await hash(newPassword) });
		//res.status(202).send("CHANGE PASSWORD OK");
		res.redirect("/revoke");
	});
};
