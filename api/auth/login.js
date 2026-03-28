import { getDB } from "../../lib/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password wajib diisi"
      });
    }

    const db = await getDB();

    // 🔥 ambil user dari database
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    // 🔐 cek password
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Password salah"
      });
    }

    // 🎟️ buat token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
