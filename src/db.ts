import { MongoClient } from 'mongodb';
import { config } from './config.ts';

const client = new MongoClient(config.database.MONGO_URI);
let db: any;

const connectDB = async () => {
  if (db) return db;
  try {
    await client.connect();
    db = client.db(config.database.DB_NAME);
    console.log('MongoDB Connected');
  } catch (error: any) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    console.error('Database not initialized. Call connectDB() first.');
  }
  return db;
};

export { connectDB, getDB, client };
