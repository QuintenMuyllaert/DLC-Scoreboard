import { Request, Response } from "express";

import database from "../database";
import protect from "../utils/protect";

import { LooseObject, PermissionValue, PermissionRequest } from "../../../Interfaces/Interfaces";

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

		if (value == "*") {
			console.log("Impossible to grant permission to all");
			res.status(400).send("Impossible to grant permission to all");
			return;
		}

		const user = await database.read("accounts", { uuid: body.uuid });
		if (!user) {
			console.log("User does not exist");
			res.status(401).send("User does not exist");
			return;
		}

		const [permission] = await database.read("permissions", { serial, "users.uuid": body.uuid });
		if (!permission) {
			console.log("User does not have permissions");
			res.status(401).send("User does not have permissions");
			return;
		}

		let perms = [];
		const users = permission.users;
		for (const user of users) {
			if (user.uuid === body.uuid) {
				perms = user.permissions;
			}
		}

		const canChange = {
			user: [] as string[],
			admin: [] as string[],
			"*": [] as string[],
		};
		canChange["admin"] = ["user"];
		canChange["*"] = [...canChange["admin"], "admin"];

		const checkAs = perms.includes("*") ? "*" : perms.includes("admin") ? "admin" : "user";
		const changeAble = canChange[checkAs];

		if (!changeAble.includes(value)) {
			console.log("User does not have permission to change", value);
			res.status(401).send("User does not have permission to change : " + value);
			return;
		}

		if (!perms.includes("*") && !perms.includes("admin")) {
			console.log("User does not have permissions");
			res.status(401).send("User does not have permissions to manage permissions");
			return;
		}

		const userExists = await database.exists("accounts", { email });
		if (!userExists) {
			console.log("User does not exist");
			res.status(401).send("User does not exist");
			return;
		}

		const [account] = await database.read("accounts", { email });
		if (!account) {
			console.log("User does not exist, IMPOSSIBLE");
			res.status(401).send("User does not exist, IMPOSSIBLE");
			return;
		}

		let found = false;
		let foundUser;
		for (const user of users) {
			if (user.uuid === account.uuid) {
				found = true;
				foundUser = user;
				users.splice(users.indexOf(user), 1);
				break;
			}
		}

		if (!found) {
			foundUser = {
				uuid: account.uuid,
				permissions: [],
			};
		}

		if (type === "grant") {
			if (!foundUser.permissions.includes(value)) {
				foundUser.permissions.push(value);
			}
		}
		if (type === "revoke") {
			foundUser.permissions = foundUser.permissions.filter((perm: PermissionValue) => perm !== value);
		}

		users.push(foundUser);

		await database.update("permissions", { serial }, { users });
		res.send(users);
	});
};
