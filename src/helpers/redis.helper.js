const redis = require("redis");
const client = redis.createClient({ url: process.env.REDIS_URL });

client.connect()
  .then(() => console.log("Connected to Redis server"))
  .catch(console.error);

client.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

client.on("end", () => {
  console.log("Disconnected from Redis server");
});

const setJWT = async (key, value) => {
  try {
    await client.set(key, value);
    console.log(`Set key ${key} with value ${value} in Redis`);
    return true;
  } catch (error) {
    console.error("Error setting JWT in Redis:", error);
    throw error;
  }
};

const getJWT = async (key) => {
  try {
    const value = await client.get(key);
    console.log(`Got value ${value} for key ${key} from Redis`);
    return value;
  } catch (error) {
    console.error("Error getting JWT from Redis:", error);
    throw error;
  }
};

const deleteJWT = async (key) => {
  try {
      if (typeof key !== 'string') {
          throw new TypeError("Invalid argument type: key must be a string");
      }
      await client.del(key);
      console.log(`Deleted key ${key} from Redis`);
  } catch (error) {
      console.error("Error deleting JWT from Redis:", error);
      throw error;
  }
};


module.exports = {
  setJWT,
  getJWT,
  deleteJWT,
};
