import captureWebsite from "capture-website";
import { readFileSync } from "fs";

const config = {
  width: 428,
  height: 926,
};

const routesFile = readFileSync("../Frontend/src/App.tsx").toString();

const rawRoutes = routesFile.match(/path=".+?"/g);
const endpoints = [];

for (const route of rawRoutes) {
  endpoints.push(route.replace('path="/', "").replace('"', ""));
}

for (let route of endpoints) {
  await captureWebsite.file("http://127.0.0.1/" + route, `img/cap-${route}.png`, config);
}
