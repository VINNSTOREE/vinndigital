import { CONFIG } from "../../lib/config.js";

const r = await fetch("https://ramashop.my.id/api/public/deposit/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": CONFIG.API_KEY
  },
  body: JSON.stringify({ amount })
});
