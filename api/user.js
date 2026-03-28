// api/user.js
import { getDB } from "../lib/db.js";
import { verifyToken } from "../lib/auth.js";

export default async function handler(req, res) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ success: false });

  const db = await getDB();
  const data = await db.collection("users").findOne({ email: user.email });

  res.json({ email: data.email, saldo: data.saldo });
}