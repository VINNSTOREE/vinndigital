import { CONFIG } from "../../lib/config.js";

export default async function handler(req, res) {
  try {
    const { amount } = req.body;

    const r = await fetch("https://ramashop.my.id/api/public/deposit/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": CONFIG.API_KEY
      },
      body: JSON.stringify({ amount })
    });

    const data = await r.json();

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
