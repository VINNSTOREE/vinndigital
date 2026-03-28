import { CONFIG } from "../../lib/config.js";

const r = await fetch(`https://ramashop.my.id/api/public/deposit/status/${id}`, {
  headers: {
    "X-API-Key": CONFIG.API_KEY
  }
});
