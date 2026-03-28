import { CONFIG } from "../../lib/config.js";
import { getDB } from "../../lib/db.js";
import { getUserByApiKey } from "../../lib/apikey.js";

export default async function handler(req, res) {
  try {
    const user = await getUserByApiKey(req);
    if (!user) {
      return res.status(401).json({ success: false, message: "API Key tidak valid" });
    }

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

    await db.collection("deposits").insertOne({
      userId: user._id,
      depositId: data.data.depositId,
      amount: data.data.amount,
      status: "pending"
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}