import { Request, Response } from "express";

import database from "../database";
import protect from "../utils/protect";

import { hash, validateHash } from "../crypto";
import { emailRegex, LooseObject, User, userdataData } from "../../../Interfaces/Interfaces";

//userdata
export default {
	get: async (req: Request, res: Response) => {
		console.log("Got userdata get request");
		await protect(req, res, async (body: LooseObject) => {
			if (!body.uuid) {
				console.log("Invalid JWT");
				return;
			}

			const [user] = (await database.read("accounts", { uuid: body.uuid })) as unknown as User[];
			if (!user) {
				console.log("User does not exist");
				res.status(401).send("User does not exist");
				return;
			}

			user.password = "";

			res.send(user);
		});
	},
	post: async (req: Request, res: Response) => {
		console.log("Got userdata post request");
		await protect(req, res, async (body: LooseObject) => {
			if (!body.uuid) {
				console.log("Invalid JWT");
				return;
			}

			const { newUsername, newEmail, newPassword, password } = req.body as unknown as userdataData;
			console.log(newUsername, newEmail, newPassword, password);

			const [user] = (await database.read("accounts", { uuid: body.uuid })) as unknown as User[];
			if (!user) {
				console.log("User does not exist");
				res.status(401).send("User does not exist");
				return;
			}

			const valid = await validateHash(password, user?.password);
			if (!valid) {
				console.log("Invalid password");
				res.status(401).send("Invalid password");
				return;
			}

			if (newUsername && newUsername !== user.username) {
				console.log("Updating username");
				user.username = newUsername;
			}

			if (newEmail && newEmail !== user.email) {
				const email = newEmail.toLowerCase();
				if (email.match(emailRegex)) {
					const exists = await database.exists("accounts", { email });
					if (!exists) {
						console.log("Updating email");
						user.email = newEmail;
					} else {
						console.log("Email already exists");
						res.status(400).send("Email already exists");
						return;
					}
				}
			}

			if (newPassword) {
				console.log("Updating password");
				user.password = await hash(newPassword);
			}

			database.update("accounts", { uuid: body.uuid }, user);
			database.delete("jwt", { uuid: body.uuid });
			res.clearCookie("bearer");
			res.clearCookie("auth");
			res.send("Success");
		});
	},
};
