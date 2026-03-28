const { getDB } = require("../../lib/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { CONFIG } = require("../../lib/config");

module.exports = async function handler(req, res) {
  try {
    const { email, password } = req.body;

    const db = await getDB();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.json({ success:false, message:"Akun tidak ditemukan" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({ success:false, message:"Password salah" });
    }

    const token = jwt.sign(
      { id:user._id },
      CONFIG.JWT_SECRET
    );

    res.json({ success:true, token });

  } catch (err) {
    res.json({ success:false, message:"Error server" });
  }
}
