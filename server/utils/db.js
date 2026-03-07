// const mongoose = require('mongoose');

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectDB() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(process.env.MONGO_URL, {
//       maxPoolSize: 20,            // Number of connections in pool
//       serverSelectionTimeoutMS: 5000, // Fail fast if Mongo unreachable
//       socketTimeoutMS: 45000,     // Close idle sockets
//       family: 4                  // Use IPv4
//     })
//     .then((mongoose) => {
//       console.log("MongoDB Connected");
//       return mongoose;
//     })
//     .catch((err) => {
//       cached.promise = null; // Allow retry
//       throw err;
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// module.exports = connectDB;

const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URL, {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    }).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;  
    throw err;
  }

  return cached.conn;
}

module.exports = connectDB;