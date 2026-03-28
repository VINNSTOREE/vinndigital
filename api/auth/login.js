import { getDB } from "../../lib/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { CONFIG } from "../../lib/config.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false });
    }

    const { email, password } = req.body;

    const db = await getDB();

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Password salah"
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      CONFIG.JWT_SECRET,
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
