import { Request, Response } from "express";

import database from "../database";
import protect from "../utils/protect";
import { LooseObject } from "../../../Interfaces/Interfaces";

//getusers
export default async (req: Request, res: Response) => {
	console.log("Got getusers request");
	await protect(req, res, async (body: LooseObject) => {
		if (!body.uuid) {
			console.log("Invalid JWT");
			return;
		}

		const { serial } = req.query;
		if (!serial) {
			console.log("Missing serial");
			res.status(400).send("Missing serial");
			return;
		}

		const scoreboards = await database.read("permissions", { serial, "users.uuid": body.uuid });
		if (!scoreboards.length) {
			console.log("User does not have permissions");
			res.status(401).send("User does not have permissions");
			return;
		}

		const users = [];
		for (const scoreboard of scoreboards) {
			for (const user of scoreboard.users) {
				const uuid = user.uuid;
				const [account] = await database.read("accounts", { uuid });
				if (account) {
					delete account.password;
					users.push(account);
				}
			}
		}

		res.status(200).send(users);
	});
};
