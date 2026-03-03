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

  if (!cached[uriName]) {
    cached[uriName] = { conn: null, promise: null };
  }

  if (cached[uriName].conn) {
    return cached[uriName].conn;
  }

  if (!cached[uriName].promise) {
    const opts = {
      bufferCommands: false,
    };

    cached[uriName].promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached[uriName].conn = await cached[uriName].promise;
  } catch (e) {
    cached[uriName].promise = null;
    throw e;
  }

  return cached[uriName].conn;
}

export default dbConnect;
