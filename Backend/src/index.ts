"use-strict";
import dotenv from "dotenv";
import http from "http";
import path from "path";

import { existsSync, writeFileSync, readFileSync } from "fs";
import { randomBytes } from "crypto";

import { app } from "./app";
import { attachSocketIO } from "./socket";

export const dirname = process.cwd();
export const config = JSON.parse(readFileSync(path.join(dirname, "config.json"), "utf8"));

if (!existsSync("./.env")) {
	const SECRET = randomBytes(64).toString("hex");
	writeFileSync("./.env", `TOKEN_SECRET=${SECRET}`);
}

// get config vars
dotenv.config();

const server = http.createServer(app);

if (!existsSync("./.use-https")) {
	console.log("Starting server in HTTP mode");
	// start the Express server
	attachSocketIO(server);
	server.listen(config?.port || 80, "0.0.0.0", () => {
		console.log(`server started at http://0.0.0.0:${config?.port}`);
	});
} else {
	console.log("Starting server in HTTPS mode");
	require("greenlock-express")
		.init({
			packageRoot: dirname,
			configDir: "./greenlock.d",

			// contact for security and critical bug notices
			maintainerEmail: "quinten.muyllaert@student.howest.be",
			cluster: false,
		})
		.ready(httpsWorker);

	function httpsWorker(glx: any) {
		var server = glx.httpsServer();

		attachSocketIO(server);

		// servers a node app that proxies requests to a localhost
		glx.serveApp(app);
	}
}
