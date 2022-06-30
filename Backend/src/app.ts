import path from "path";

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
//@ts-ignore
import siofu from "socketio-file-upload";
import { readdirSync, statSync, existsSync, unlinkSync, rmdirSync } from "fs";

import database from "./database";
import { extractToken, hasAccess, jwtVerifyAsync, jwtSignAsync, hash, validateHash, generateSerial } from "./crypto";
import { gengetNamespace } from "./socket";
import { User, LooseObject, Template } from "./schema/schema";
import { delay } from "./util";

export const dirname = process.cwd();
export const app = express();

// HTTP(S) webserver
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(siofu.router);

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

app.post("/auth", async (req: Request, res: Response) => {
	console.log("Got auth request");
	const { username, password } = req.body;
	if (!username || !password) {
		console.log("Missing username or password");
		res.status(400).send("Missing username or password");
		return;
	}
	const userExists = await database.exists("accounts", { username });
	if (!userExists) {
		console.log(username + " does not exist");
		res.status(401).send("Invalid username or password");
		return;
	}
	const [userdata] = await database.read("accounts", { username });
	const valid = await validateHash(password, userdata?.password);
	if (!valid) {
		console.log(username + " hash does not match");
		res.status(401).send("Hash does not match");
		return;
	}

	const tokenBody = { username: userdata?.username, serial: userdata?.serial, isAdmin: userdata?.isAdmin };
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

	console.log("Sending auth", username, obj);
	database.update("accounts", { username }, { ...userdata, firstLogin: false });
	res.status(202).send(JSON.stringify(obj, null, 4));
});

app.post("/register", async (req: Request, res: Response) => {
	const { username, password } = req.body;
	let { serial } = req.body;
	if (!username || !password || !serial) {
		console.log("Missing username or password or serial");
		console.log({ username, serial });
		res.status(400).send("Missing username or password or serial");
		return;
	}

	const userExists = await database.exists("accounts", { username });
	if (userExists) {
		console.log(username + " already exists");
		res.status(401).send("User exists");
		return;
	}

	if (serial === "virtual") {
		console.log("Generating virtual scoreboard");
		serial = await generateSerial("virtual-");
		await gengetNamespace(serial, true);
		console.log("Generated virtual scoreboard", serial);
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
			username,
			password: await hash(password),
			serial,
			isAdmin: true,
			firstLogin: false,
		};
		await database.update("scoreboards", { serial }, { ...scoreboarddata, hasAdmin: true });
		await database.create("accounts", newUser);
		res.status(202).send("REGISTER ADMIN OK");
	} else {
		console.log("Scoreboard already has admin, making user");
		const newUser: User = {
			username,
			password: await hash(password),
			serial,
			isAdmin: false,
			firstLogin: true,
		};
		await database.create("accounts", newUser);
		res.status(202).send("REGISTER USER OK");
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

app.put("/edituser", async (req: Request, res: Response) => {
	await protect(req, res, async (body: LooseObject) => {
		const { serial, username } = body;
		if (!serial) {
			res.status(400).send("Missing serial");
			return;
		}

		const { currentUsername, newUsername } = req.body;

		if (username != currentUsername) {
			res.status(400).send("Invalid username (not the same)");
			return;
		}

		if (!newUsername || !currentUsername) {
			res.status(400).send("Missing username");
			return;
		}
		const [userdata] = await database.read("accounts", { serial, username: currentUsername });
		if (!userdata) {
			res.status(401).send("User does not exist");
			return;
		}
		await database.update("accounts", { serial, username: currentUsername }, { ...userdata, username: newUsername });
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

app.get("/sponsors", async (req: Request, res: Response) => {
	console.log("e");
	await protect(req, res, (body: LooseObject) => {
		const { serial } = body;
		const serialQ = req?.query?.serial;

		if (!serial) {
			res.status(401).send("No serial");
			return;
		}

		if (serial !== serialQ) {
			res.status(401).send("Serial mismatch");
			return;
		}

		const tree: LooseObject = [];
		const folder = `www/${serial}/`;
		const files = readdirSync(folder);
		for (const file of files) {
			const stat = statSync(`${folder}/${file}`);
			if (!stat.isFile()) {
				tree.push({
					name: file,
					children: readdirSync(path.join(folder, file)),
				});
			}
		}

		res.status(200);
		res.send(JSON.stringify(tree, null, 4));
	});
});

app.delete("/sponsors", async (req: Request, res: Response) => {
	await protect(req, res, (body: LooseObject) => {
		const { serial } = body;
		if (!serial) {
			res.status(401).send("No serial");
			return;
		}

		const queryParams = req.query;
		const { bundle, file } = queryParams;
		if (!bundle || !file) {
			res.status(400);
			res.send("Invalid / Missing bundle and/or file");
			return;
		}

		const exists = existsSync(`www/${serial}/${bundle}/${file}`);
		if (!exists) {
			res.status(404);
			res.send("File not found");
			return;
		}

		unlinkSync(`www/${serial}/${bundle}/${file}`);
		res.status(200);
	});
});

app.delete("/folder", async (req: Request, res: Response) => {
	await protect(req, res, (body: LooseObject) => {
		const { serial } = body;
		if (!serial) {
			res.status(401).send("No serial");
			return;
		}

		const queryParams = req.query;
		const { bundle } = queryParams;
		if (!bundle) {
			res.status(404);
			res.send("Invalid / Missing bundle");
			return;
		}

		const exists = existsSync(`www/${serial}/${bundle}`);
		if (!exists) {
			res.status(404);
			res.send("Folder not found");
			return;
		}

		rmdirSync(`www/${serial}/${bundle}`, { recursive: true });
		res.status(200);
		res.send(`Folder ${bundle} deleted`);
	});
});

app.post("/template", async (req: Request, res: Response) => {
	await protect(req, res, async (body: LooseObject) => {
		const { serial } = body;
		if (!serial) {
			res.status(401).send("No serial");
			return;
		}

		const { name, parts, duration } = req.body;
		if (!(name && parts && duration)) {
			console.log("Missing params on template");
			res.status(400); // Bad Request
			res.send("Invalid / Missing username and/or password");
			return;
		}

		const newTemplate: Template = {
			name,
			parts,
			duration,
			serial,
		};

		await database.create("templates", newTemplate);
		res.status(202).send("TEMPLATE OK");
	});
});

app.get("/template", async (req: Request, res: Response) => {
	await protect(req, res, async (body: LooseObject) => {
		const { serial } = body;
		if (!serial) {
			res.status(401).send("No serial");
			return;
		}

		const templates = await database.read("templates", { serial });
		res.status(200);
		res.send(JSON.stringify(templates, null, 4));
	});
});

app.put("/template", async (req: Request, res: Response) => {
	await protect(req, res, async (body: LooseObject) => {
		const { serial } = body;
		if (!serial) {
			res.status(401).send("No serial");
			return;
		}

		const { name, parts, duration, currentName } = req.body;
		if (!(name && parts && duration && currentName)) {
			console.log("Missing params on template");
			res.status(400); // Bad Request
			res.send("Invalid / Missing username and/or password or currentName");
			return;
		}

		const newTemplate: Template = {
			name,
			parts,
			duration,
			serial,
		};

		await database.update("templates", { serial, name: currentName }, newTemplate);
		res.status(202).send("TEMPLATE OK");
	});
});

app.delete("/template", async (req: Request, res: Response) => {
	await protect(req, res, async (body: LooseObject) => {
		const { serial } = body;
		if (!serial) {
			res.status(401).send("No serial");
			return;
		}

		const { name } = req.body;
		if (!name) {
			console.log("Missing params on template");
			res.status(400); // Bad Request
			res.send("Invalid / Missing username and/or password");
			return;
		}

		await database.delete("templates", { serial, name });
		res.status(202).send("TEMPLATE OK");
	});
});

app.get("/user", async (req: Request, res: Response) => {
	await protect(req, res, async (body: LooseObject) => {
		const { serial, isAdmin } = body;
		if (!serial || !isAdmin) {
			res.status(401).send("No serial");
			return;
		}
		const users = [];
		const usersDB = await database.read("accounts", { serial });
		for (const user of usersDB) {
			users.push({
				username: user?.username,
				isAdmin: user?.isAdmin,
			});
		}

		res.status(200);
		res.send(JSON.stringify(users, null, 4));
	});
});

app.delete("/user", async (req: Request, res: Response) => {
	await protect(req, res, async (body: LooseObject) => {
		const { serial, isAdmin } = body;
		if (!serial || !isAdmin) {
			res.status(401).send("No serial");
			return;
		}

		const { username } = req.body;
		if (!username) {
			console.log("Missing params on user");
			res.status(400); // Bad Request
			res.send("Invalid / Missing username");
			return;
		}

		await database.delete("accounts", { serial, username, isAdmin: false });
		res.status(202).send("USER OK");
	});
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
