export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const r = await fetch("https://ramashop.my.id/api/public/deposit/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "rg_92de2603ed65af6487074222c8757a"
      },
      body: JSON.stringify(req.body)
    });

    const data = await r.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ success: false, message: err.toString() });
  }
}