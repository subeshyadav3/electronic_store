const Redis = require('ioredis');

let redisClient;

if (!global.redisClient) {
  global.redisClient = new Redis(process.env.REDIS_URL, {
    tls: process.env.REDIS_URL.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
    maxRetriesPerRequest: 3,     // limit retries
    enableOfflineQueue: true,    // queue commands while reconnecting
    connectTimeout: 5000,        // fail fast if cannot connect
  });
}

redisClient = global.redisClient;

redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('ready', () => console.log('Redis ready'));
redisClient.on('error', (err) => console.log('Redis error:', err));
redisClient.on('close', () => console.log('Redis connection closed'));

module.exports = redisClient;