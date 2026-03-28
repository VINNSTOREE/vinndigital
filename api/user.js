import { getDB } from "../lib/db.js";
import { verifyToken } from "../lib/auth.js";

export default async function handler(req, res) {
  try {
    const userData = verifyToken(req);
    if (!userData) {
      return res.status(401).json({ success: false });
    }

    const db = await getDB();

    const user = await db.collection("users").findOne({
      email: userData.email
    });

    res.status(200).json({
      email: user.email,
      saldo: user.saldo
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}
