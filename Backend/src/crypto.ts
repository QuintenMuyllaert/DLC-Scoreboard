import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

import database from "./database";
import { LooseObject } from "./schema/schema";

export type Connection = Request | any;

export const hash = async (str: string) => {
	return await bcrypt.hash(str, await bcrypt.genSalt(10));
};

export const validateHash = async (plaintext: string, hash: string) => {
	return await bcrypt.compare(plaintext, hash);
};

export const snowflakes: LooseObject = {};
export const jwtVerifyAsync = async (token: string) => {
	let ret = { valid: false, body: {} as any };

	ret = await new Promise((resolve, reject) => {
		jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, body: any) => {
			if (!err) {
				//Token is valid!
				resolve({ valid: true, body });
			}

			//Token is invalid!
			resolve({ valid: false, body });
		});
	});

	ret.body = ret.body === undefined ? ({} as any) : ret.body;

	if (ret.valid) {
		console.log("Token valid");
		if (!ret?.body?.snowflake) {
			console.log("No snowflake on token");
			ret.valid = false;
		} else if (!snowflakes[ret?.body?.snowflake]) {
			console.log("Snowflake not cached");
			const [reply] = await database.read("jwt", { snowflake: ret?.body?.snowflake });
			console.log("Snowflake from db: " + reply);
			if (reply) {
				console.log("Snowflake cached");
				snowflakes[ret?.body?.snowflake] = true;
			}
		}
		ret.valid = snowflakes[ret.body.snowflake];
		console.log("Snowflake valid: " + ret.valid);
	}
	return ret;
};

export const jwtSignAsync = async (body: any) => {
	const snowflake = Math.random() * 10000000000000000 + ":" + Date.now();
	await database.create("jwt", { ...body, snowflake });
	return await jwt.sign({ ...body, snowflake }, process.env.TOKEN_SECRET as string);
};

export const hasAccess = async (body: any, requirements: any) => {
	const requiredKeys = Object.keys(requirements);
	for (const requiredKey of requiredKeys) {
		if (!body.hasOwnProperty(requiredKey)) {
			console.log("Missing required key: " + requiredKey);
			return false;
		}
		if (requirements[requiredKey] !== "*" && body[requiredKey] !== requirements[requiredKey]) {
			console.log("Invalid value for key: " + requiredKey);
			return false;
		}
	}
	console.log("Access granted!");
	return true;
};

export const extractToken = (connection: Connection) => {
	const fromHttp = connection?.cookies?.bearer;
	const fromHeader = connection?.headers?.authorization;

	const cookief = connection?.handshake?.headers?.cookie;
	const cookies = cookief ? cookie.parse(connection?.handshake?.headers?.cookie) : {};
	const fromSocket = cookies?.bearer;

	const token = fromHttp || fromHeader || fromSocket;
	console.log("Token: ", fromHttp, fromHeader, fromSocket);
	return token;
};

export const generateSerial = (pre = "", post = "") => {
	const a = Math.random();
	a.toString(36).split(".").pop();
	return pre + a + post;
};
