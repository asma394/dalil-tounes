import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("يرجى تعريف MONGODB_URI في ملف .env.local");
}

const cached = globalThis as typeof globalThis & {
  mongooseConnection?: typeof mongoose;
};

const mongooseConnection =
  cached.mongooseConnection ?? (cached.mongooseConnection = mongoose);

async function connectDB() {
  if (mongooseConnection.connection.readyState >= 1) {
    return;
  }

  await mongooseConnection.connect(MONGODB_URI);
}

export default connectDB;