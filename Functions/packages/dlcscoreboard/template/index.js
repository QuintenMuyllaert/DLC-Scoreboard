const database = require("./modules/database");
const parse = require("./modules/parse");
const protect = require("./modules/protect");
const getEmitter = require("./modules/emitter");

exports.main = async (args) => {
  const req = parse(args);
  return await protect(req, async (body) => {
    const { serial } = body;
    const data = {
      type: req.body.type,
      value: JSON.parse(req.body.value),
      serial,
    };

    console.log("template", data);
    if (!(data && data.value && typeof data.value === "object" && !Array.isArray(data.value) && data.value !== null)) {
      return {
        status: 400,
        message: "Invalid data",
      };
    }

    let _id;
    if (data.value._id) {
      _id = new database.ObjectId(data.value._id);
      delete data.value._id;
    }

    switch (data.type) {
      case "create":
        await database.create("templates", data.value);
        break;
      case "read":
        //REDUNDANT
        break;
      case "update":
        await database.update("templates", { serial, _id }, data.value);
        break;
      case "delete":
        await database.delete("templates", { serial, _id });
    }

    console.log("Getting templates");
    const templates = await database.read("templates", { serial });
    console.log("Templates", templates);
    console.log("Getting emitter");
    const emitter = await getEmitter();
    console.log("Connected to emitter!");
    emitter.in(`${serial}-USER`).emit("Appstate", "templates", templates);
    console.log("Broadcasted!");
    return { status: 202, data: templates };
  });
};
