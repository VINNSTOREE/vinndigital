import { MongoClient } from "mongodb";
import { CONFIG } from "./config.js";

let client;

export async function getDB() {
  if (!client) {
    client = new MongoClient(CONFIG.MONGO_URI);
    await client.connect();
  }
  return client.db("vinnpay");
}
