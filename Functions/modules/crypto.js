const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const database = require("./database");

const snowflakes = {};

exports.hash = async (str) => {
  return await bcrypt.hash(str, await bcrypt.genSalt(10));
};

exports.validateHash = async (plaintext, hash) => {
  return await bcrypt.compare(plaintext, hash);
};

exports.jwtVerifyAsync = async (token) => {
  let ret = { valid: false, body: {} };

  ret = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, body) => {
      if (!err) {
        //Token is valid!
        resolve({ valid: true, body });
      }

      //Token is invalid!
      resolve({ valid: false, body });
    });
  });

  ret.body = ret.body === undefined ? {} : ret.body;

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

exports.jwtSignAsync = async (body) => {
  const snowflake = Math.random() * 10000000000000000 + ":" + Date.now();
  await database.create("jwt", { ...body, snowflake });
  return await jwt.sign({ ...body, snowflake }, process.env.TOKEN_SECRET);
};

exports.hasAccess = async (body, requirements) => {
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

exports.extractToken = (connection) => {
  const fromHttp = connection?.cookies?.bearer;
  const fromHeader = connection?.headers?.authorization?.replace?.("Bearer ", "");

  const token = fromHttp || fromHeader;
  console.log("Token: ", fromHttp, fromHeader);
  return token;
};

exports.generateSerial = (pre = "", post = "") => {
  const a = Math.random();
  a.toString(36).split(".").pop();
  return pre + a + post;
};
