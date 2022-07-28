const database = require("./modules/database");
const parse = require("./modules/parse");
const protect = require("./modules/protect");
const { validateHash, hash } = require("./modules/crypto");

exports.main = async (args) => {
  const req = parse(args);
  return await protect(req, async (body) => {
    const { username } = body;
    const { currentPassword, newPassword } = req.body;
    if (!username || !currentPassword || !newPassword) {
      return { status: 400, message: "Missing username or password" };
    }
    const [userdata] = await database.read("accounts", { username });
    if (!userdata) {
      return { status: 401, message: "User does not exist" };
    }
    const valid = await validateHash(currentPassword, userdata?.password);
    if (!valid) {
      return { status: 401, message: "Invalid password" };
    }
    await database.update("accounts", { username }, { ...userdata, password: await hash(newPassword) });
    //res.redirect("/revoke");

    return { status: 202, message: "Password changed" };
  });
};
