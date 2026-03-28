import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  try {
    const client = new MongoClient(
      "mongodb+srv://vingg1633_db_user:Hanzo1211k@cluster0.jiteouc.mongodb.net/vinnpay?retryWrites=true&w=majority&tls=true"
    );

    await client.connect();

    const db = client.db("vinnpay");

    const result = await db.collection("test").insertOne({
      name: "VINN TEST",
      time: new Date()
    });

    res.status(200).json({
      success: true,
      message: "MongoDB CONNECTED",
      data: result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}