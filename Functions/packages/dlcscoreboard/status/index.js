const database = require("./modules/database");
const parse = require("./modules/parse");
const protect = require("./modules/protect");
const { extractToken, jwtVerifyAsync, validateHash, jwtSignAsync, generateSerial, hash } = require("./modules/crypto");

exports.main = async (args) => {
  const req = parse(args);
  return await protect(req, (body) => {
    console.log("Permission granted");
    console.log("Sending status", body);
    return { body: body };
  });
};
