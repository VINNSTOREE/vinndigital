import { getDB } from "../../lib/db.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false });
    }

    const { email, password } = req.body;

    const db = await getDB();

    const exist = await db.collection("users").findOne({ email });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      email,
      password: hash,
      saldo: 0,
      createdAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: "Register berhasil"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
