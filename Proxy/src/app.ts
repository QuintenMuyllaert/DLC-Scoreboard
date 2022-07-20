import path from "path";

import express, { Request, Response } from "express";

export const dirname = process.cwd();
export const app = express();

app.use((req: Request, res: Response, next: Function) => {
	if (req.path.includes(".")) {
		next();
		return;
	}

	// React needs each route to point to index.html
	try {
		res.sendFile(path.join(dirname, "../Frontend/dist/index.html"));
	} catch (e) {
		res.sendFile(path.join(dirname, "../Frontend/old_dist/index.html"));
	}
});

//Static files
app.use("/data", express.static(path.join(dirname, "www")));
app.use(express.static(path.join(dirname, "../Frontend/dist")));
