const database = require("./modules/database");
const parse = require("./modules/parse");
const { extractToken, jwtVerifyAsync } = require("./modules/crypto");

exports.main = async (args) => {
  const req = parse(args);
  const token = extractToken(req);
  if (token) {
    const { valid, body } = await jwtVerifyAsync(token);
    if (valid) {
      await database.delete("jwt", { username: body?.username });
    }
  }

  //res.clearCookie("bearer");
  //res.clearCookie("auth");
  //res.redirect("/logout");
  return { body: true };
};
