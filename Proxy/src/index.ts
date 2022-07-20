"use-strict";
import http from "http";
import path from "path";

import { existsSync } from "fs";
import { app } from "./app";

const server = http.createServer(app);

if (!existsSync("./.use-https")) {
	console.log("Starting server in HTTP mode");

	server.listen(80, "0.0.0.0", () => {
		console.log(`server started at http://0.0.0.0:80`);
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

	const httpsWorker = (glx: any) => {
		const server = glx.httpsServer();
		glx.serveApp(app);
	};
}
