// const Redis = require('ioredis');

// let redisClient;

// if (!global.redisClient) {

//   global.redisClient = new Redis(process.env.REDIS_URL, {
//     tls: { rejectUnauthorized: false }, 
//     lazyConnect: false,            
//     reconnectOnError: (err) => {
//       console.log('Redis reconnect triggered:', err.message);
//       return true;
//     },
//     retryStrategy: (times) => Math.min(times * 50, 2000),
//   });

//   global.redisClient.on('connect', () => console.log('Redis connected'));
//   global.redisClient.on('error', (err) => console.log('Redis error:', err));
//   global.redisClient.on('close', () => console.log('Redis connection closed'));
// }

// redisClient = global.redisClient;

// module.exports = redisClient;