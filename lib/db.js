import { MongoClient } from "mongodb";
import { CONFIG } from "./config.js";

const client = new MongoClient(CONFIG.MONGO_URI, {
  tls: true
});

let clientPromise;

if (!global._mongoClientPromise) {
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function getDB() {
  const conn = await clientPromise;
  return conn.db("vinnpay");
}
