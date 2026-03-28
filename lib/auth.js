import jwt from "jsonwebtoken";
import { CONFIG } from "./config.js";

export function verifyToken(req) {
  const token = req.headers.authorization;
  if (!token) return null;

  try {
    return jwt.verify(token, CONFIG.JWT_SECRET);
  } catch {
    return null;
  }
}
