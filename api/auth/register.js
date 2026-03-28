// api/auth/register.js
import { getDB } from "../../lib/db.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const db = await getDB();
  const { email, password } = req.body;

  const exist = await db.collection("users").findOne({ email });
  if (exist) return res.json({ success: false, message: "Email sudah ada" });

  const hash = await bcrypt.hash(password, 10);

  await db.collection("users").insertOne({
    email,
    password: hash,
    saldo: 0,
    createdAt: new Date()
  });

  res.json({ success: true });
}