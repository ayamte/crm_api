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

const deleteJWT = (key) =>{
    try {
      client.del(key);
    } catch (error) {
      console.log(error);
    }
};



module.exports = {
  setJWT,
  getJWT,
  deleteJWT,
};
