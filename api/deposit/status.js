import { CONFIG } from "../../lib/config.js";
import { getDB } from "../../lib/db.js";

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    const db = await getDB();

    const trx = await db.collection("deposits").findOne({ depositId: id });
    if (!trx) return res.status(404).json({ error: "Transaksi tidak ditemukan" });

    const r = await fetch(`https://ramashop.my.id/api/public/deposit/status/${id}`, {
      headers: {
        "X-API-Key": CONFIG.API_KEY
      }
    });

    const data = await r.json();

    // 🔥 kalau sukses & belum diproses
    if (data?.data?.status === "success" && trx.status !== "success") {

      // update status
      await db.collection("deposits").updateOne(
        { depositId: id },
        { $set: { status: "success" } }
      );

      // tambah saldo user
      await db.collection("users").updateOne(
        { _id: trx.userId },
        { $inc: { saldo: trx.amount } }
      );
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
