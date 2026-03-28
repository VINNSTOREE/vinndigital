// api/deposit/create.js
import { getDB } from "../../lib/db.js";
import { verifyToken } from "../../lib/auth.js";

export default async function handler(req, res) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ success: false });

  const { amount } = req.body;

  const r = await fetch("https://ramashop.my.id/api/public/deposit/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.API_KEY
    },
    body: JSON.stringify({ amount })
  });

  const data = await r.json();
  const db = await getDB();

  await db.collection("transactions").insertOne({
    email: user.email,
    depositId: data.data.depositId,
    amount: data.data.totalAmount,
    status: "pending",
    createdAt: new Date()
  });

  res.json(data);
}