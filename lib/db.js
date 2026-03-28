const { MongoClient } = require("mongodb");
const { CONFIG } = require("./config");

let client;

async function getDB(){
  if(!client){
    client = new MongoClient(CONFIG.MONGO_URI);
    await client.connect();
    console.log("✅ Mongo Connected");
  }
  return client.db("vinnpay");
}

module.exports = { getDB };
