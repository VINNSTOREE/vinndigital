const { getDB } = require("../../lib/db");
const { CONFIG } = require("../../lib/config");

module.exports = async function handler(req, res){
  try {
    const apiKey = req.headers["x-api-key"];
    const { amount } = req.body;

    if(!apiKey){
      return res.json({ success:false, message:"API KEY wajib" });
    }

    if(!amount || isNaN(amount)){
      return res.json({ success:false, message:"Amount tidak valid" });
    }

    const db = await getDB();

    const user = await db.collection("users").findOne({ apiKey });

    if(!user){
      return res.json({ success:false, message:"API KEY tidak valid" });
    }

    const fetch = require("node-fetch");

    const create = await fetch("https://ramashop.my.id/api/public/deposit/create",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": CONFIG.API_KEY   // 🔥 FIX DI SINI
      },
      body: JSON.stringify({
        amount: Number(amount)
      })
    });

    const result = await create.json();

    console.log("RAMASHOP RESPONSE:", result);

    if(!result.success){
      return res.json({
        success:false,
        message: result.message || "Gagal create deposit",
        debug: result
      });
    }

    await db.collection("deposits").insertOne({
      userId: user._id,
      depositId: result.data.depositId,
      amount: Number(amount),
      total: result.data.totalAmount,
      status: "pending",
      createdAt: new Date()
    });

    return res.json({
      success:true,
      data: result.data
    });

  } catch(err){
    console.log("DEPOSIT ERROR:", err);

    return res.json({
      success:false,
      message:"Server error",
      error: err.message
    });
  }
};
