import mongoose from "mongoose";
import { getEnv } from "@/lib/env";

declare global { var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined }
const cache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;

export async function connectToDatabase() {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    const env = getEnv();
    cache.promise = mongoose.connect(env.MONGODB_URI, { dbName: env.MONGODB_DB_NAME, bufferCommands: false });
  }
  try { cache.conn = await cache.promise; return cache.conn; }
  catch (error) { cache.promise = null; throw new Error("Unable to connect to MongoDB", { cause: error }); }
}
