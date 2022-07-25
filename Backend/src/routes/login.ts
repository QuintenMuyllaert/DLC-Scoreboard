import { Request, Response } from "express";

import database from "../database";
import { validateHash, jwtSignAsync } from "../crypto";

//login
export default async (req: Request, res: Response) => {
	console.log("Got login request");
	let { email, password } = req.body;
	if (!email || !password) {
		console.log("Missing email or password");
		res.status(400).send("Missing email or password");
		return;
	}

	email = email.toLowerCase();

	const userExists = await database.exists("accounts", { email });
	if (!userExists) {
		console.log(email + " does not exist");
		res.status(401).send("Invalid email or password");
		return;
	}
	const [userdata] = await database.read("accounts", { email });
	const valid = await validateHash(password, userdata?.password);
	if (!valid) {
		console.log(email + " hash does not match");
		res.status(401).send("Hash does not match");
		return;
	}

	const tokenBody = { uuid: userdata.uuid };
	const token = await jwtSignAsync(tokenBody);
	console.log("Signing token", tokenBody);
	res.cookie("bearer", token, {
		maxAge: 30 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	});
	res.cookie("auth", true, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false });
	const obj = {
		status: "OK",
		firstLogin: userdata?.firstLogin,
	};

	console.log("Sending auth", email, obj);
	database.update("accounts", { email }, { ...userdata, firstLogin: false });
	res.status(200).send(JSON.stringify(obj, null, 4));
};
