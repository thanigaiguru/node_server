import { MongoClient } from "mongodb";

let cachedClient = null;
let cachedDb = null;

export async function connectDB() {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();

  cachedClient = client;
  cachedDb = client.db("logserver"); // DB name

  return cachedDb;
}
