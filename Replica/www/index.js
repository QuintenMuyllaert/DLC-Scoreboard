const colorLUT = {
  Groen: "green",
  LichtBlauw: "lightblue",
  DonkerBlauw: "darkblue",
  Blauw: "blue",
  Wit: "white",
  Zwart: "black",
  Geel: "yellow",
  Rood: "red",
  Oranje: "orange",
  Bordeaux: "darkred",
};

const socket = io();
document.addEventListener("DOMContentLoaded", () => {
  socket.on("time", (time) => {
    let sec = time % 60;
    let min = (time - sec) / 60;

    if (min < 10) {
      min = `0${min}`;
    }

    if (sec < 10) {
      sec = `0${sec}`;
    }

    document.querySelector("#clock").innerHTML = `${min}:${sec}`;
  });

  socket.on("t1", (score) => {
    document.querySelector("#t1").innerHTML = score;
  });

  socket.on("t2", (score) => {
    document.querySelector("#t2").innerHTML = score;
  });

  socket.on("message", (msg) => {
    document.querySelector("#msg").innerHTML = msg;
  });

  socket.on("color", (name, color) => {
    document.querySelector("#" + name).style.backgroundColor = colorLUT[color];
  });
});
