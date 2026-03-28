const { getDB } = require("../../lib/db");
const bcrypt = require("bcryptjs");

function generateApiKey(){
  return "vp_" + Math.random().toString(36).substring(2,10) + Date.now();
}

module.exports = async function handler(req, res){
  try{
    const { email, password } = req.body;

    if(!email || !password){
      return res.json({ success:false, message:"Isi semua field" });
    }

    const db = await getDB();

    const cek = await db.collection("users").findOne({ email });

    if(cek){
      return res.json({ success:false, message:"Email sudah terdaftar" });
    }

    const hash = await bcrypt.hash(password, 10);

    const apiKey = generateApiKey(); // 🔥 generate key

    await db.collection("users").insertOne({
      email,
      password: hash,
      saldo: 0,
      apiKey,
      createdAt: new Date()
    });

    res.json({ success:true });

  }catch(err){
    console.log(err);
    res.json({ success:false, message:"Error server" });
  }
}
