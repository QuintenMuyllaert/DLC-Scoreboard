const database = require("./modules/database");
const parse = require("./modules/parse");
const protect = require("./modules/protect");
const { uploadFile } = require("./modules/s3");
const { decode } = require("./modules/image-data-uri");

exports.main = async (args) => {
  const req = parse(args);
  const { uri, name } = req.body;
  if (!uri) {
    return { status: 400, body: "Missing uri" };
  }
  if (!name) {
    return { status: 400, body: "Missing name" };
  }
  if (name.includes("..")) {
    return { status: 400, body: "Path escape not allowed" };
  }

  return await protect(req, async (body) => {
    const { serial, isAdmin } = body;
    if (!isAdmin) {
      return { status: 403, body: "You are not allowed to do this" };
    }
    if (!serial) {
      return { status: 400, body: "Missing serial - THIS SHOULD NEVER BE POSSIBLE" };
    }

    const data = decode(uri);
    const path = `data/${serial}/${name}`;
    await uploadFile(path, data.dataBuffer);

    return { status: 201, body: `File uploaded successfully "${path}"` };
  });
};
