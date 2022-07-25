import { Request, Response } from "express";

import database from "../database";
import protect from "../utils/protect";

import { hash, uuid } from "../crypto";
import { User, linkData, LooseObject } from "../../../Interfaces/Interfaces";

//link
export default async (req: Request, res: Response) => {
	await protect(req, res, async (body: LooseObject) => {
		if (!body.uuid) {
			console.log("Invalid JWT");
			return;
		}

		const { serial, name } = req.body as linkData;
		const { uuid } = body;

		if (!serial || !name) {
			console.log("Missing serial or name");
			res.status(400).send("Missing serial or name");
			return;
		}

		const userExists = await database.exists("accounts", { uuid });
		if (!userExists) {
			console.log("User does not exist");
			res.status(401).send("User does not exist");
			return;
		}

		const scoreboardExists = await database.exists("scoreboards", { serial });
		if (!scoreboardExists) {
			console.log("Scoreboard does not exist" + serial);
			res.status(401).send(`Scoreboard does not exist : ${serial}`);
			return;
		}

		const [scoreboarddata] = await database.read("scoreboards", { serial });
		if (!scoreboarddata.hasAdmin) {
			console.log("Scoreboard does not have admin");

			//TODO : refresh scoreboards after setting this ↙
			await database.update(
				"scoreboards",
				{ serial },
				{
					...scoreboarddata,
					hasAdmin: true,
					name: name,
					message: "DLC Scoreboard | Made with 💙 by Quinten",
					sponsors: ["https://dlcscoreboard.computernetwork.be/img/favicon.png"],
				},
			);

			await database.create("permissions", {
				serial,
				users: [{ uuid, permissions: ["*"] }],
			});
			res.status(201).send("LINK OK");
		}
	});
};
