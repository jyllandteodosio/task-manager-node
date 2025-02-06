const { MongoClient } = require("mongodb");
const config = require("./config");

// MongoDB Connection
const client = new MongoClient(config.database.MONGO_URI);
let db;

const connectDB = async () => {
  if (db) return db;
  try {
    await client.connect();
    db = client.db(config.database.DB_NAME);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }
  return db;
};

module.exports = { connectDB, getDB };

