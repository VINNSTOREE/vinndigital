import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

export async function getDB() {
  if (!client.topology?.isConnected()) await client.connect();
  return client.db("vinnpay");
}