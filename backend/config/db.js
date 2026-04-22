/**
 * @file db.js
 * @description Connects our backend to MongoDB using Mongoose.
 * 
 * HOW IT WORKS:
 * - We call this function once when the server starts.
 * - It reads the MONGO_URI from our .env file.
 * - Retries once on failure before exiting.
 * - Does NOT fall back to in-memory in production (data would be lost on restart).
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  // Dev/CI mode: If placeholder URI, spin up an In-Memory Server
  if (!uri || uri.includes('<username>') || uri.includes('cluster.mongodb.net/bharatpath')) {
    console.log('🔧 Placeholder MONGO_URI detected. Starting In-Memory MongoDB for local dev...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    console.log(`🍃 In-Memory MongoDB Started: ${uri}`);
  }

  // Retry logic: try up to 2 times with a 3-second gap
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const conn = await mongoose.connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
      return; // success — exit the function
    } catch (error) {
      console.error(`❌ MongoDB Connection attempt ${attempt} failed: ${error.message}`);
      if (attempt === 1) {
        console.log('⏳ Retrying in 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        // Both attempts failed — crash hard so Render logs it clearly
        console.error('💥 Could not connect to MongoDB after 2 attempts. Exiting.');
        console.error('👉 Fix: Go to MongoDB Atlas → Network Access → Add 0.0.0.0/0');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
