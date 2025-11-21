import { connectDB } from "../utils/db.js";

export default async function handler(req, res) {
  try {
    const db = await connectDB();
    const logs = await db.collection("logs")
      .find({})
      .sort({ timestamp: -1 })
      .limit(200)
      .toArray();

    res.status(200).json(logs);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
