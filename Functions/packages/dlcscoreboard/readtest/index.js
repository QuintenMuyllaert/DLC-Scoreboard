const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const parse = require("./modules/parse");

exports.main = async (args) => {
  //Args has all query params
  console.log(parse(args));
  return { body: parse(args) };
};
