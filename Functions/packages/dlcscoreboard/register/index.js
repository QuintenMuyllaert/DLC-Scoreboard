const database = require("./modules/database");
const parse = require("./modules/parse");
const { hash } = require("./modules/crypto");

exports.main = async (args) => {
  const req = parse(args);

  const { username, password, serial } = req.body;
  if (!username || !password || !serial) {
    console.log("Missing username or password or serial");
    console.log({ username, serial });
    return { status: 400, message: "Missing username or password or serial" };
  }

  const userExists = await database.exists("accounts", { username });
  if (userExists) {
    console.log(username + " already exists");
    return { status: 401, message: "User exists" };
  }

  const scoreboardExists = await database.exists("scoreboards", { serial });
  if (!scoreboardExists) {
    console.log("Scoreboard does not exist" + serial);
    return { status: 401, message: `Scoreboard does not exist : ${serial}` };
  }

  const [scoreboarddata] = await database.read("scoreboards", { serial });

  if (!scoreboarddata.hasAdmin) {
    console.log("Scoreboard does not have admin");
    const newUser = {
      username,
      password: await hash(password),
      serial,
      isAdmin: true,
      firstLogin: false,
    };
    await database.update("scoreboards", { serial }, { ...scoreboarddata, hasAdmin: true });
    await database.create("accounts", newUser);
    return { status: 202, message: "REGISTER ADMIN OK" };
  } else {
    console.log("Scoreboard already has admin, making user");
    const newUser = {
      username,
      password: await hash(password),
      serial,
      isAdmin: false,
      firstLogin: true,
    };
    await database.create("accounts", newUser);
    return { status: 202, message: "REGISTER USER OK" };
  }
};
