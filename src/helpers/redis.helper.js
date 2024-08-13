const redis = require("redis");
const client = redis.createClient({ url: process.env.REDIS_URL });

client.connect().catch(console.error);


client.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

client.on("connect", () => {
  console.log("Connected to Redis server");
});

client.on("end", () => {
  console.log("Disconnected from Redis server");
});

const setJWT = (key, value) => { 
  console.log(typeof key, typeof value);
  return new Promise((resolve, reject) => {
    try {
      client.set(key, value, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getJWT = (key) => {
  return new Promise((resolve, reject) => {
    try {
      client.get(key, (err, res) => {
        if (err) {
          console.error('Error getting data from Redis:', err);
          reject(err);
        } else {
          resolve(res);
        }
      });
    } catch (error) {
      console.error('Error in getJWT function:', error);
      reject(error);
    }
  });
};

module.exports = {
  setJWT,
  getJWT,
};
