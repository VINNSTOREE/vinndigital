export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: "ID wajib diisi" });
  }

  try {
    const r = await fetch(`https://ramashop.my.id/api/public/deposit/status/${id}`, {
      headers: {
        "X-API-Key": "rg_92de2603ed65af6487074222c8757a"
      }
    });

    const data = await r.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ success: false, message: err.toString() });
  }
}