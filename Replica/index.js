const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(cors("*"));
app.use(express.static(path.join(__dirname, "www")));

let teams = [
  { colors: ["black", "black"], score: 0 },
  { colors: ["black", "black"], score: 0 },
];

let time = 0;

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("time", time);
  socket.emit("t1", teams[0].score);
  socket.emit("t2", teams[1].score);
  socket.emit("color", "K1B", teams[0].colors[0]);
  socket.emit("color", "K1O", teams[0].colors[1]);
  socket.emit("color", "K2B", teams[1].colors[0]);
  socket.emit("color", "K2O", teams[1].colors[1]);
  socket.emit("message", boardMessage);
});

setInterval(() => {
  time++;
  io.emit("time", time);
}, 1000);

let boardMessage = "";

app.get("/update", (req, res) => {
  console.log("Update");
  const { Timer, G1, G2, K1B, K2B, K1O, K2O, Keuze, message } = req.query;
  if (G1) {
    if (G1 == "NEXT") {
      teams[0].score += 1;
    } else if (G1 == "PREVIOUS") {
      teams[0].score -= 1;
    } else if (G1 == "T0") {
      teams[0].score = 0;
    }

    if (teams[0].score <= 0) {
      teams[0].score = 0;
    }
    if (teams[0].score >= 50) {
      teams[0].score = 50;
    }

    io.emit("t1", teams[0].score);
  }

  if (G2) {
    if (G2 == "NEXT") {
      teams[1].score += 1;
    } else if (G2 == "PREVIOUS") {
      teams[1].score -= 1;
    } else if (G2 == "U0") {
      teams[1].score = 0;
    }

    if (teams[1].score <= 0) {
      teams[1].score = 0;
    }
    if (teams[1].score >= 50) {
      teams[1].score = 50;
    }

    io.emit("t2", teams[1].score);
  }

  if (K1B) {
    teams[0].colors[0] = K1B;
    io.emit("color", "K1B", K1B);
  }
  if (K1O) {
    teams[0].colors[1] = K1O;
    io.emit("color", "K1O", K1O);
  }
  if (K2B) {
    teams[1].colors[0] = K2B;
    io.emit("color", "K2B", K2B);
  }
  if (K2O) {
    teams[1].colors[1] = K2O;
    io.emit("color", "K2O", K2O);
  }

  if (message) {
    boardMessage = message;
    io.emit("message", message);
  }

  if (Timer == "Ti0") {
    time = "N/A";
  }

  if (Timer == "Ti1") {
    time = 0;
  }

  if (Timer == "Ti2") {
    time = 60 * 45;
  }

  if (Timer == "Ti3") {
    time = new Date(Date.now()).getHours() * 60 + new Date(Date.now()).getMinutes();
  }

  if (Timer == "Ti4") {
    time = 60 * 5;
  }

  if (Timer) {
    io.emit("time", time);
  }

  //TODO : "Keuze"

  res.status(200); //204
  res.send("OK");
});

server.listen(1234);
