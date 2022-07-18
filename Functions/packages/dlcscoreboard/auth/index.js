const database = require("./modules/database");
const { extractToken, jwtVerifyAsync, validateHash, jwtSignAsync, generateSerial, hash } = require("./modules/crypto");

exports.main = async (args) => {
  console.log("Got auth request");
  //TODO: Find out how to get body from DigitalOcean)
  const username = args?.username || "";
  const password = args?.password || "";

  if (!username || !password) {
    console.log("Missing username or password");
    return { body: { status: 400, body: "Missing username or password" } };
  }

  const userExists = await database.exists("accounts", { username });
  if (!userExists) {
    console.log(username + " does not exist");
    return { body: { status: 401, message: "Invalid username or password" } };
  }

  const [userdata] = await database.read("accounts", { username });
  const valid = await validateHash(password, userdata?.password);
  if (!valid) {
    console.log(username + " hash does not match");
    return { body: { status: 401, message: "Hash does not match" } };
  }

  const tokenBody = { username: userdata?.username, serial: userdata?.serial, isAdmin: userdata?.isAdmin };
  const token = await jwtSignAsync(tokenBody);
  console.log("Signing token", tokenBody);

  //TODO : Find out how to use cookies on DigitalOcean
  /*
  res.cookie("bearer", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.cookie("auth", true, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false });
  */

  const obj = {
    status: 202,
    message: "Success",
    firstLogin: userdata?.firstLogin,
    token,
  };

  console.log("Sending auth", username, obj);
  database.update("accounts", { username }, { ...userdata, firstLogin: false });

  return { body: obj };
};
