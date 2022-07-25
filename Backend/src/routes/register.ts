import { Request, Response } from "express";

import database from "../database";
import { hash, uuid } from "../crypto";
import { User, registerData, emailRegex } from "../../../Interfaces/Interfaces";

//register
export default async (req: Request, res: Response) => {
	let { username, password, email, serial, name } = req.body as registerData;

	if (!username || !password || !email || !serial || !name) {
		console.log("Missing username or password or email or serial or name");
		res.status(400).send("Missing username or password or email or serial or name");
		return;
	}

	email = email.toLowerCase();

	if (!email.match(emailRegex)) {
		console.log("Invalid email");
		res.status(400).send("Invalid email");
		return;
	}

	const userExists = await database.exists("accounts", { email });
	if (userExists) {
		console.log(username + " already exists");
		res.status(401).send("User exists");
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
		const newUser: User = {
			uuid: uuid(),
			username,
			password: await hash(password),
			email,
			firstLogin: false,
		};

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

		await database.create("accounts", newUser);
		await database.create("permissions", {
			serial,
			users: [{ uuid: newUser.uuid, permissions: ["*"] }],
		});
		res.status(202).send("REGISTER ADMIN OK");
	}
};
