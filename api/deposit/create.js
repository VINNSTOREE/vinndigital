const { getDB } = require("../../lib/db");

module.exports = async function handler(req, res){
  try{
    const apiKey = req.headers["x-api-key"];
    const { amount } = req.body;

    if(!apiKey){
      return res.json({ success:false, message:"API KEY wajib" });
    }

    const db = await getDB();

    const user = await db.collection("users").findOne({ apiKey });

    if(!user){
      return res.json({ success:false, message:"API KEY tidak valid" });
    }

    // 🔥 HIT API RAMASHOP
    const fetch = require("node-fetch");

    const create = await fetch("https://ramashop.my.id/api/public/deposit/create",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "X-API-Key":"rg_92de2603ed65af6487074222c8757a"
      },
      body:JSON.stringify({ amount })
    });

    const result = await create.json();

    if(!result.success){
      return res.json({ success:false });
    }

    // simpan transaksi
    await db.collection("deposits").insertOne({
      userId: user._id,
      depositId: result.data.depositId,
      amount: result.data.amount,
      total: result.data.totalAmount,
      status: "pending"
    });

    res.json({
      success:true,
      data: result.data
    });

  }catch(err){
    console.log(err);
    res.json({ success:false });
  }
}
