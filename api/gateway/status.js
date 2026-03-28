import { CONFIG } from "../../lib/config.js";
import { getDB } from "../../lib/db.js";
import { getUserByApiKey } from "../../lib/apikey.js";

export default async function handler(req, res) {
  try {
    const user = await getUserByApiKey(req);
    if (!user) return res.status(401).json({ success: false });

    const { id } = req.query;
    const db = await getDB();

    const trx = await db.collection("deposits").findOne({ depositId: id });

    const r = await fetch(`https://ramashop.my.id/api/public/deposit/status/${id}`, {
      headers: {
        "X-API-Key": CONFIG.API_KEY
      }
    });

    const data = await r.json();

    if (data?.data?.status === "success" && trx.status !== "success") {

      await db.collection("deposits").updateOne(
        { depositId: id },
        { $set: { status: "success" } }
      );

      await db.collection("users").updateOne(
        { _id: trx.userId },
        { $inc: { saldo: trx.amount } }
      );
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}