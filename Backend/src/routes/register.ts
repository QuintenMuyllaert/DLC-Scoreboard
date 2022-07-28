import { Request, Response } from "express";

import database from "../database";
import { hash, uuid } from "../crypto";
import { User, registerData, emailRegex } from "../../../Interfaces/Interfaces";

//register
export default async (req: Request, res: Response) => {
	let { username, password, email, isRandomPassword } = req.body as registerData;

	if (!username || !password || !email) {
		console.log("Missing username or password or email");
		res.status(400).send("Missing username or password or email");
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

	const newUser: User = {
		uuid: uuid(),
		username,
		password: await hash(password),
		email,
		firstLogin: isRandomPassword || false,
	};
	await database.create("accounts", newUser);
	res.status(201).send("REGISTER OK");
};
