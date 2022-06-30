const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

io.on("connection", (socket) => {
  console.log("a user connected");

  const to2 = (num) => {
    return num.toString().length <= 1 ? "0" + num : num;
  };

  let i = 0;
  setInterval(() => {
    let color = hslToHex(i, 100, 50);
    i++;
    i = i % 360;

    let d = new Date(Date.now());

    socket.emit("data", "#hb", "attr", "style", `fill:${color}`);
    socket.emit("data", "#ub", "attr", "style", `fill:${color}`);
    socket.emit("data", "#ub", "attr", "style", `fill:${color}`);
    socket.emit("data", "#timer", "text", to2(d.getHours()) + ":" + to2(d.getMinutes()));
    socket.emit("data", "#message", "attr", "x", 1.2 * 336 - ((performance.now() * 0.04) % (336 * 2 * 1.2)));
    socket.emit("data", "#message", "text", "Quinten was here SOCKETIO WORKS :D");
  }, 1);

  socket.on("data", (data) => {
    console.log(data);
  });
});

app.get("/", (req, res) => {
  res.send("OK");
});

server.listen(1234);
