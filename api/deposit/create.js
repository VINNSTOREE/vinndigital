import { CONFIG } from "../../lib/config.js";
import { getDB } from "../../lib/db.js";
import { verifyToken } from "../../lib/auth.js";

export default async function handler(req, res) {
  try {
    const userData = verifyToken(req);
    if (!userData) return res.status(401).json({ success: false });

    const { amount } = req.body;
    const db = await getDB();

    const r = await fetch("https://ramashop.my.id/api/public/deposit/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": CONFIG.API_KEY
      },
      body: JSON.stringify({ amount })
    });

    const data = await r.json();

    // 🔥 simpan transaksi
    await db.collection("deposits").insertOne({
      userId: userData.id,
      depositId: data.data.depositId,
      amount: data.data.amount,
      status: "pending",
      createdAt: new Date()
    });

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
