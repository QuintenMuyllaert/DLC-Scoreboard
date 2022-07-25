import path from "path";

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { extractToken, jwtVerifyAsync, validateHash, jwtSignAsync, generateSerial, hash, uuid } from "./crypto";
import database from "./database";
import { LooseObject, User, registerData, emailRegex } from "../../Interfaces/Interfaces";

export const dirname = process.cwd();
export const app = express();

// HTTP(S) webserver
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use((req: Request, res: Response, next: any) => {
	//set cache header on png & jpg
	console.log("req.url", req.url);
	if (req.url.endsWith(".png") || req.url.endsWith(".jpg")) {
		console.log("setting cache header");
		res.setHeader("Cache-Control", "public, max-age=7200");
	}
	next();
});

//DEFINE API ROUTES BELOW !!!

const protect = async (req: Request, res: Response, onSuccess: any = () => {}) => {
	const token = extractToken(req);
	if (!token) {
		res.status(401).send("No token");
		return false;
	}

	const { valid, body } = await jwtVerifyAsync(token);
	if (!valid) {
		res.clearCookie("bearer");
		res.clearCookie("auth");
		res.status(401).send("Invalid token");
		return false;
	}

	onSuccess(body);
};

app.get("/status", async (req: Request, res: Response) => {
	console.log("Got status request");
	await protect(req, res, (body: LooseObject) => {
		console.log("Permission granted");
		console.log("Sending status", body);
		res.send(body);
	});
});

app.get("/scoreboards", async (req: Request, res: Response) => {
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
});

app.post("/auth", async (req: Request, res: Response) => {
	console.log("Got auth request");
	const { email, password } = req.body;
	console.log(req.body);
	console.log(email, password);
	if (!email || !password) {
		console.log("Missing email or password");
		res.status(400).send("Missing email or password");
		return;
	}
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
	res.status(202).send(JSON.stringify(obj, null, 4));
});

app.post("/register", async (req: Request, res: Response) => {
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
});

app.put("/changepassword", async (req: Request, res: Response) => {
	await protect(req, res, async (body: LooseObject) => {
		const { username } = body;
		const { currentPassword, newPassword } = req.body;
		if (!username || !currentPassword || !newPassword) {
			res.status(400).send("Missing username or password");
			return;
		}
		const [userdata] = await database.read("accounts", { username });
		if (!userdata) {
			res.status(401).send("User does not exist");
			return;
		}
		const valid = await validateHash(currentPassword, userdata?.password);
		if (!valid) {
			res.status(401).send("Invalid password");
			return;
		}
		await database.update("accounts", { username }, { ...userdata, password: await hash(newPassword) });
		//res.status(202).send("CHANGE PASSWORD OK");
		res.redirect("/revoke");
	});
});

app.get("/logout", async (req: Request, res: Response) => {
	const token = extractToken(req);
	if (token) {
		const { valid, body } = await jwtVerifyAsync(token);
		if (valid) {
			await database.delete("jwt", { snowflake: body?.snowflake });
		}
	}

	res.clearCookie("bearer");
	res.clearCookie("auth");
	res.redirect("/");
});

app.get("/revoke", async (req: Request, res: Response) => {
	const token = extractToken(req);
	if (token) {
		const { valid, body } = await jwtVerifyAsync(token);
		if (valid) {
			await database.delete("jwt", { username: body?.username });
		}
	}

	res.clearCookie("bearer");
	res.clearCookie("auth");
	res.redirect("/logout");
});

//DEFINE API ROUTES ABOVE !!!

app.use((req: Request, res: Response, next: Function) => {
	if (req.path.includes(".")) {
		next();
		return;
	}

	// React needs each route to point to index.html
	res.sendFile(path.join(dirname, "../Frontend/dist/index.html"));
});

//Static files
app.use("/data", express.static(path.join(dirname, "www")));
app.use(express.static(path.join(dirname, "../Frontend/dist")));
