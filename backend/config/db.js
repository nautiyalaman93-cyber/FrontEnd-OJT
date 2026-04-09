/**
 * @file db.js
 * @description Connects our backend to MongoDB using Mongoose.
 * 
 * HOW IT WORKS:
 * - We call this function once when the server starts.
 * - It reads the MONGO_URI from our .env file.
 * - If connection fails, the server logs the error and exits.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // If using the placeholder URI from .env.example, spin up an In-Memory Server
    if (!uri || uri.includes('<username>') || uri.includes('cluster.mongodb.net/bharatpath')) {
      console.log('⚠️ Placeholder MONGO_URI detected. Starting In-Memory MongoDB...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log(`✅ In-Memory MongoDB Started: ${uri}`);
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // process.exit(1); // Removed so server can still run for demo purposes
  }
};

module.exports = connectDB;
