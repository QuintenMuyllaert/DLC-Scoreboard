import { Request, Response } from "express";

import database from "../database";
import protect from "../utils/protect";

import { LooseObject, PermissionRequest } from "../../../Interfaces/Interfaces";

import { grantPermission, revokePermission, getPermissionsFor, addUserToPermissions, removeUserFromPermissions } from "../permission";

//permission
export default async (req: Request, res: Response) => {
	console.log("Got request");
	await protect(req, res, async (body: LooseObject) => {
		if (!body.uuid) {
			console.log("Invalid JWT");
			return;
		}

		const { serial, type, value, email } = req.body as unknown as PermissionRequest;

		if (!serial || !type || !value || !email) {
			console.log("Missing serial or type or value or email");
			res.status(400).send("Missing serial or type or value or email");
			return;
		}

		const [otherUser] = await database.read("accounts", { email });
		if (!otherUser) {
			console.log("User does not exist");
			res.status(401).send("User does not exist");
			return;
		}

		switch (type) {
			case "grant": {
				const success = await grantPermission(serial, body.uuid, otherUser.uuid, value);
				res.status(200).send(success);
				break;
			}
			case "revoke": {
				const success = await revokePermission(serial, body.uuid, otherUser.uuid, value);
				res.status(200).send(success);
				break;
			}
			case "list": {
				const permissions = await getPermissionsFor(serial, otherUser.uuid);
				res.send(permissions);
				break;
			}
			case "addUser": {
				const success = await addUserToPermissions(serial, body.uuid, otherUser.uuid);
				res.status(200).send(success);
				break;
			}
			case "removeUser": {
				const success = await removeUserFromPermissions(serial, body.uuid, otherUser.uuid);
				res.status(200).send(success);
				break;
			}
			default: {
				console.log("Invalid type");
				res.status(400).send("Invalid type");
				return;
			}
		}
	});
};
