import { CONFIG } from "../../lib/config.js";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    const r = await fetch(`https://ramashop.my.id/api/public/deposit/status/${id}`, {
      headers: {
        "X-API-Key": CONFIG.API_KEY
      }
    });

    const data = await r.json();

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
