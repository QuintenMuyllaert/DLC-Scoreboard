import path from "path";

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import auth from "./routes/auth";
import register from "./routes/register";
import status from "./routes/status";
import scoreboards from "./routes/scoreboards";
import changepassword from "./routes/changepassword";
import logout from "./routes/logout";
import revoke from "./routes/revoke";

export const dirname = process.cwd();
export const app = express();

// HTTP(S) webserver

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

//DEFINE API ROUTES BELOW !!!

app.post("/auth", auth);
app.post("/register", register);
app.get("/status", status);
app.get("/scoreboards", scoreboards);
app.put("/changepassword", changepassword);
app.get("/logout", logout);
app.get("/revoke", revoke);

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
