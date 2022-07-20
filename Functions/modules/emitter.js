const { Emitter } = require("@socket.io/redis-emitter");
const { createClient } = require("redis");

const redisClient = createClient({ url: process.env["REDIS_CONNECTION"] });

module.exports = async () => {
  if (!redisClient.connected) {
    await redisClient.connect();
  }
  const emitter = new Emitter(redisClient);
  return emitter;
};
