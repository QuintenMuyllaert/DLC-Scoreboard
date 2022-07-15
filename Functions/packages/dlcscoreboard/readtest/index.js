const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");

exports.main = async (args) => {
  //Args has all query params
  console.log("Entry");
  console.log(process.env["MONGO_CONNECTION"]);
  const client = new MongoClient(process.env["MONGO_CONNECTION"]);
  console.log("Client");
  await client.connect();
  console.log("Connected");
  const db = client.db("IndustryProject");
  console.log("DB");
  const collection = db.collection("accounts");
  console.log("Collection");
  const account = await collection.findOne({ username: args.username });
  delete account.password;
  console.log("Account");

  if (account) {
    console.log("Account found");
    return { body: account };
  }

  console.log("Account not found");
  return { body: ":(" };
};
