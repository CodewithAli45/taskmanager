import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: any;
  promise: any;
}

let cached: { [key: string]: MongooseCache } = (global as any).mongoose || {};

if (!(global as any).mongoose) {
  (global as any).mongoose = cached;
}

async function dbConnect(uriName: 'MONGODB_URI' | 'MONGODB_URI_USERS' = 'MONGODB_URI') {
  const MONGODB_URI = process.env[uriName];

  if (!MONGODB_URI) {
    throw new Error(`Please define the ${uriName} environment variable`);
  }

  // Initialize cache for this specific URI if it doesn't exist
  if (!cached[uriName]) {
    cached[uriName] = { conn: null, promise: null };
  }

  // Return existing connection if available
  if (cached[uriName].conn) {
    return cached[uriName].conn;
  }

  // If no promise exists, create one
  if (!cached[uriName].promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log(`Connecting to MongoDB using ${uriName}...`);
    cached[uriName].promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log(`Connected to MongoDB successfully via ${uriName}`);
      return m;
    });
  }

  try {
    cached[uriName].conn = await cached[uriName].promise;
  } catch (e: any) {
    console.error(`MongoDB connection error for ${uriName}:`, e.message);
    cached[uriName].promise = null;
    throw e;
  }

  return cached[uriName].conn;
}

export default dbConnect;
