const { Redis } = require("@upstash/redis");

let redis;

if (!global.redis) {
  global.redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  console.log("Redis client initialized");
}

redis = global.redis;

module.exports = redis;