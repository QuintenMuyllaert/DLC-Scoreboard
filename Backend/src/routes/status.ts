import { Request, Response } from "express";

import protect from "../utils/protect";
import { LooseObject } from "../../../Interfaces/Interfaces";

//status
export default async (req: Request, res: Response) => {
	console.log("Got status request");
	await protect(req, res, (body: LooseObject) => {
		console.log("Permission granted");
		console.log("Sending status", body);
		res.send(body);
	});
};
