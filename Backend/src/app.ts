import path from "path";

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import login from "./routes/login";
import register from "./routes/register";
import status from "./routes/status";
import scoreboards from "./routes/scoreboards";
import logout from "./routes/logout";
import link from "./routes/link";
import permission from "./routes/permission";
import userdata from "./routes/userdata";
import getusers from "./routes/getusers";

export const dirname = process.cwd();
export const app = express();

// HTTP(S) webserver

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

//DEFINE API ROUTES BELOW !!!

app.post("/login", login);
app.post("/register", register);
app.get("/status", status);
app.get("/scoreboards", scoreboards);
app.get("/logout", logout);
app.post("/link", link);
app.post("/permission", permission);
app.get("/userdata", userdata.get);
app.post("/userdata", userdata.post);
app.get("/getusers", getusers);

//DEFINE API ROUTES ABOVE !!!

app.use((req: Request, res: Response, next: any) => {
	//set cache header on png & jpg
	console.log("req.url", req.url);
	if (req.url.endsWith(".png") || req.url.endsWith(".jpg")) {
		console.log("setting cache header");
		res.setHeader("Cache-Control", "public, max-age=7200");
	}
	next();
});

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
