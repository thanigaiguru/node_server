import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL;
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect(); // cache the promise globally
}

clientPromise = global._mongoClientPromise;

export async function connectDB() {
  const client = await clientPromise;
  return client.db("logserver");
}
