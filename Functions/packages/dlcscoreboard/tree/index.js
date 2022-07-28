const database = require("./modules/database");
const parse = require("./modules/parse");
const protect = require("./modules/protect");
const { readDir } = require("./modules/s3.js");
const { decode } = require("./modules/image-data-uri");

exports.main = async (args) => {
  const req = parse(args);
  const { folder } = req.body;

  if (!folder) {
    return { status: 400, body: "Missing folder" };
  }
  if (folder.includes("..")) {
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

    const data = await readDir(`data/${body.serial}/${folder}`);

    if (!data.Contents) {
      return { status: 404, body: [] };
    }

    const uris = [];
    for (const file of data.Contents) {
      console.log(file.Key);
      uris.push(`https://dlcscoreboard.fra1.cdn.digitaloceanspaces.com/${file.Key}`);
    }

    console.log(uris);

    return {
      status: 200,
      body: uris,
    };
  });
};
