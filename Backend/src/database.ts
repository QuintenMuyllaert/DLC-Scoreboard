import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const connstr = process.env.MONGO_CONNECTION as string;
const database = new MongoClient(connstr);
const dbName = "IndustryProject";

export type CollectionName = "accounts" | "scoreboards" | "templates" | "colors" | "jwt";

export const dbConnect = async () => {
	await database.connect();
	console.log("Connected to database");
};

export const dbCreate = async (collectionName: CollectionName, data: any, unique: boolean = true) => {
	if (unique && (await dbExists(collectionName, data))) {
		console.log("Already exists");
		return;
	}

	await dbConnect();
	const db = database.db(dbName);
	const collection = db.collection(collectionName);
	await collection.insertOne(data);
};

export const dbRead = async (collectionName: CollectionName, query: any) => {
	await dbConnect();
	const db = database.db(dbName);
	const collection = db.collection(collectionName);
	const result = await collection.find(query).toArray();
	return result;
};

export const dbUpdate = async (collectionName: CollectionName, query: any, data: any) => {
	await dbConnect();
	const db = database.db(dbName);
	const collection = db.collection(collectionName);
	await collection.updateOne(query, { $set: data });
};

export const dbDelete = async (collectionName: CollectionName, query: any) => {
	await dbConnect();
	const db = database.db(dbName);
	const collection = db.collection(collectionName);
	await collection.deleteMany(query);
};

export const dbExists = async (collectionName: CollectionName, query: any) => {
	await dbConnect();
	const db = database.db(dbName);
	const collection = db.collection(collectionName);
	const result = await collection.find(query).toArray();
	return result.length > 0;
};

export const dbCreateUpdate = async (collectionName: CollectionName, query: any, data: any) => {
	await dbConnect();
	const db = database.db(dbName);
	const collection = db.collection(collectionName);
	const result = await collection.find(query).toArray();
	if (result.length > 0) {
		await collection.updateOne(query, { $set: data });
	} else {
		await collection.insertOne(data);
	}
};

export default {
	connect: dbConnect,
	create: dbCreate,
	read: dbRead,
	update: dbUpdate,
	delete: dbDelete,
	exists: dbExists,
	createUpdate: dbCreateUpdate,
};
