import jwt from "jsonwebtoken";
import { CONFIG } from "../../lib/config.js";

const token = jwt.sign(
  { email: user.email },
  CONFIG.JWT_SECRET,
  { expiresIn: "7d" }
);
