console.log("Important notice! This needs to be executed AFTER the build of ( Frontend AND Functions ) and BEFORE the deployment of FRONTEND.");

import fs from "fs";
import { exec } from "child_process";

if (!fs.existsSync("./meta.json")) {
  console.log("Please create a meta.json file > npm run serverless-uri");
  process.exit(1);
}

const meta = JSON.parse(fs.readFileSync("./meta.json").toString());
const folder = meta.packages[0].name;
const functions = [];
for (const func of meta.packages[0].functions) {
  functions.push(func.name);
}

const uri = [];
for (const functionName of functions) {
  uri.push(`${folder}/${functionName}`);
}

if (!uri.length) {
  console.log("No functions found");
  process.exit(1);
}

console.log(uri);

const apiRoutes = {};
exec(`doctl serverless functions get "${uri[0]}" --url`).stdout.on("data", (data) => {
  const baseUrl = data.toString().trim().replace(/\n/g, "").replace(/\r/g, "").replace(/\s/g, "").replace(uri[0], "");
  console.log(baseUrl);
  for (const i in uri) {
    apiRoutes[functions[i]] = baseUrl + uri[i];
  }
  console.log(apiRoutes);
  fs.writeFileSync("../Frontend/dist/api.json", JSON.stringify(apiRoutes, null, 4));
});
