import { Request, Response } from "express";

import protect from "../utils/protect";
import database from "../database";

import { LooseObject } from "../../../Interfaces/Interfaces";

//scoreboards
export default async (req: Request, res: Response) => {
	console.log("Got scoreboard request");
	await protect(req, res, async (body: LooseObject) => {
		if (!body.uuid) {
			console.log("Invalid JWT");
			return;
		}

		const permissions = await database.read("permissions", { "users.uuid": body.uuid });
		const serials = [];
		for (const permission of permissions) {
			serials.push(permission.serial);
		}

		const scoreboards = await database.read("scoreboards", { serial: { $in: serials } });
		const scoreboardData = [];
		for (const scoreboard of scoreboards) {
			scoreboardData.push({
				name: scoreboard.name,
				serial: scoreboard.serial,
			});
		}

		console.log("Sending scoreboards", scoreboardData);
		res.send(scoreboardData);
	});
};
