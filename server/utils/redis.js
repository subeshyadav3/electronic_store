const Redis = require('ioredis');

let redisClient;


if (!global.redisClient) {
  global.redisClient = new Redis(process.env.REDIS_URL, {
    tls: { rejectUnauthorized: false } 
  });
}

redisClient = global.redisClient;

redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('error', (err) => console.log('Redis error:', err));

module.exports = redisClient;

