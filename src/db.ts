import mongoose from 'mongoose';

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Relies on the database name being part of the MONGO_URI string.
 */
const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    // console.log('MongoDB already connected.');
    return;
  }

  try {
    // console.log(`process.env.MONGO_URI: ${process.env.MONGO_URI}`);
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/task_manager_fallback');

    console.log(`> MongoDB Connected Successfully via Mongoose to database: ${mongoose.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose connection disconnected');
    });

  } catch (error: any) {
    console.error('Initial MongoDB Connection Failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
