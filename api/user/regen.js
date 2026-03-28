import crypto from "crypto";
import { getDB } from "../../lib/db.js";
import { verifyToken } from "../../lib/auth.js";

export default async function handler(req, res) {
  const userData = verifyToken(req);
  const db = await getDB();

  const newKey = "vk_" + crypto.randomBytes(16).toString("hex");

  await db.collection("users").updateOne(
    { _id: userData.id },
    { $set: { apiKey: newKey } }
  );

  res.json({ success: true });
}