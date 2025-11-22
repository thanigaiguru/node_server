import { connectDB } from "../utils/db.js";

export default async function handler(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("logs");

    const entry = {
      timestamp: new Date().toISOString(),
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
      path: req.url,
      method: req.method,
      query: req.query,
    };

    await collection.insertOne(entry);

    if (req.method === "HEAD") {
    	return res.sendStatus(200);  // IMPORTANT: no body for HEAD
  	}

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
