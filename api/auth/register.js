import crypto from "crypto";

const apiKey = "vk_" + crypto.randomBytes(16).toString("hex");

await db.collection("users").insertOne({
  email,
  password: hash,
  saldo: 0,
  apiKey,
  requestCount: 0,
  lastUsed: null,
  createdAt: new Date()
});
