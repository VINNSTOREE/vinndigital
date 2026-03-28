// api/deposit/status.js
import { getDB } from "../../lib/db.js";
import { verifyToken } from "../../lib/auth.js";

export default async function handler(req, res) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ success: false });

  const { id } = req.query;

  const r = await fetch(`https://ramashop.my.id/api/public/deposit/status/${id}`, {
    headers: {
      "X-API-Key": process.env.API_KEY
    }
  });

  const data = await r.json();
  const db = await getDB();

  if (data?.data?.status === "success") {
    const trx = await db.collection("transactions").findOne({ depositId: id });

    if (trx && trx.status !== "success") {
      await db.collection("users").updateOne(
        { email: trx.email },
        { $inc: { saldo: trx.amount } }
      );

      await db.collection("transactions").updateOne(
        { depositId: id },
        { $set: { status: "success" } }
      );
    }
  }

  res.json(data);
}