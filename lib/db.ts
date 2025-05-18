import mongoose from 'mongoose';

// Define interface for the cached mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define interface to extend the NodeJS.Global interface
declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://es23btech11025:khQRVsxEKiJRnfdU@ecofinds.mbriklg.mongodb.net/';

// Initialize cache
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// If not already cached on the global object, set it
if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}