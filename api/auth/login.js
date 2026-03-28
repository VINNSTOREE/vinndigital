import { getDB } from "../../lib/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CONFIG } from "../../lib/config.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method tidak diizinkan"
      });
    }

    const { email, password } = req.body;

    // VALIDASI
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password wajib diisi"
      });
    }

    const db = await getDB();

    // 🔥 AMBIL USER DULU (INI WAJIB ADA DI ATAS)
    const user = await db.collection("users").findOne({ email });

    // CEK USER
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Akun tidak ditemukan"
      });
    }

    // CEK PASSWORD
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Password salah"
      });
    }

    // BUAT TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      CONFIG.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // RESPONSE
    return res.status(200).json({
      success: true,
      token
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}
