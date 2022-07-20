const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const app = express();

dotenv.config({ path: path.join(__dirname, "../Functions/.env") });

const folder = path.join(__dirname, "../Functions/packages/dlcscoreboard");
const functions = fs.readdirSync(folder);

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors("*"));

app.use(async (req, res, next) => {
  console.log("Request URL:", req.url);

  console.log(req.body);

  const functionName = req.url.split("/")[1];
  if (functions.includes(functionName)) {
    const functionPath = `${folder}/${functionName}`;
    process.chdir(functionPath);
    const func = require(path.join(functionPath, `./index.js`));

    const digitaloceanReq = {
      ...{
        __ow_body: "",
        __ow_headers: req.headers,
        __ow_isBase64Encoded: true,
        __ow_method: req.method,
        __ow_path: req.url,
      },
      ...req.query,
      ...req.body,
    };

    const result = await func.main(digitaloceanReq);
    res.send(result.body || "");
  }
});

app.listen(3000);
