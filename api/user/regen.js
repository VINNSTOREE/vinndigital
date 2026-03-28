const { getDB } = require("../../lib/db");
const jwt = require("jsonwebtoken");
const { CONFIG } = require("../../lib/config");

function generateApiKey(){
  return "vp_" + Math.random().toString(36).substring(2,10) + Date.now();
}

module.exports = async function handler(req, res){
  try{
    const token = req.headers.authorization;

    const decode = jwt.verify(token, CONFIG.JWT_SECRET);

    const db = await getDB();

    const newKey = generateApiKey();

    await db.collection("users").updateOne(
      { _id: require("mongodb").ObjectId.createFromHexString(decode.id) },
      { $set: { apiKey: newKey } }
    );

    res.json({ success:true, apiKey:newKey });

  }catch(err){
    res.json({ success:false });
  }
}
