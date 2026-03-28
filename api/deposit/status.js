const { getDB } = require("../../lib/db");

module.exports = async function handler(req, res){
  try{
    const { depositId } = req.query;

    const db = await getDB();

    const trx = await db.collection("deposits").findOne({ depositId });

    if(!trx){
      return res.json({ success:false });
    }

    const fetch = require("node-fetch");

    const cek = await fetch(`https://ramashop.my.id/api/public/deposit/status/${depositId}`,{
      headers:{
        "X-API-Key":"rg_92de2603ed65af6487074222c8757a"
      }
    });

    const result = await cek.json();

    const status = result?.data?.status;

    // 🔥 JIKA SUKSES → TAMBAH SALDO
    if(status === "success" && trx.status !== "success"){
      await db.collection("users").updateOne(
        { _id: trx.userId },
        { $inc: { saldo: trx.amount } }
      );

      await db.collection("deposits").updateOne(
        { depositId },
        { $set: { status: "success" } }
      );
    }

    res.json({
      success:true,
      status
    });

  }catch(err){
    res.json({ success:false });
  }
      }
