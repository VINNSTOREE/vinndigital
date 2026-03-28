import { MongoClient } from "mongodb";
import { CONFIG } from "./config.js";

const client = new MongoClient(CONFIG.MONGO_URI);

let clientPromise = client.connect();

export async function getDB() {
  const conn = await clientPromise;
  return conn.db("vinnpay");
}
