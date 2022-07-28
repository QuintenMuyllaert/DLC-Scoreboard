const { MongoClient, ObjectId } = require("mongodb");

const connstr = process.env["MONGO_CONNECTION"];
const database = new MongoClient(connstr);
const dbName = "IndustryProject";

const dbConnect = async () => {
  await database.connect();
  console.log("Connected to database");
};

const dbDisconnect = async () => {
  if (!database.isConnected()) {
    return;
  }

  await database.close();
  console.log("Disconnected from database");
};

const dbCreate = async (collectionName, data, unique) => {
  if (unique && (await dbExists(collectionName, data))) {
    console.log("Already exists");
    return await dbRead(collectionName, data);
  }

  await dbConnect();
  const db = database.db(dbName);
  const collection = db.collection(collectionName);
  await collection.insertOne(data);
  return [data];
};

const dbRead = async (collectionName, query) => {
  await dbConnect();
  const db = database.db(dbName);
  const collection = db.collection(collectionName);
  const result = await collection.find(query).toArray();
  return result;
};

const dbUpdate = async (collectionName, query, data) => {
  await dbConnect();
  const db = database.db(dbName);
  const collection = db.collection(collectionName);
  await collection.updateOne(query, { $set: data });
};

const dbDelete = async (collectionName, query) => {
  await dbConnect();
  const db = database.db(dbName);
  const collection = db.collection(collectionName);
  await collection.deleteMany(query);
};

const dbExists = async (collectionName, query) => {
  await dbConnect();
  const db = database.db(dbName);
  const collection = db.collection(collectionName);
  const result = await collection.find(query).toArray();
  return result.length > 0;
};

const dbCreateUpdate = async (collectionName, query, data) => {
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

module.exports = {
  connect: dbConnect,
  create: dbCreate,
  read: dbRead,
  update: dbUpdate,
  delete: dbDelete,
  exists: dbExists,
  createUpdate: dbCreateUpdate,
  ObjectId,
};
