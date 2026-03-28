import { getDB } from "./db.js";

export async function getUserByApiKey(req) {
  const key = req.headers["x-api-key"];
  if (!key) return null;

  const db = await getDB();

  const user = await db.collection("users").findOne({ apiKey: key });
  if (!user) return null;

  // update usage
  await db.collection("users").updateOne(
    { _id: user._id },
    {
      $inc: { requestCount: 1 },
      $set: { lastUsed: new Date() }
    }
  );

  return user;
}