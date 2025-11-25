import { connectDB } from "../utils/db.js";

export default async function handler(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("logs");

    const userAgent = req.headers["user-agent"] || "";
    if (userAgent.includes("vercel")) {
      return res.status(204).end();
    }

    const entry = {
      timestamp: new Date().toLocaleString("en-US", {timeZone: 'asia/kolkata'}),
      ip: req.headers["x-forwarded-for"] || req.connection?.remoteAddress || req.socket?.remoteAddress || "unknown-ip",
      userAgent: req.headers["user-agent"],
      path: req.url,
      method: req.method,
      query: req.query,
      referer: req.headers.referer || "none",
      project_id: req.project_id || "fissionx_website",
      api_key: req.api_key || "fissionx_website",
    };

    collection.insertOne(entry).catch(() => {});
    res.removeHeader("Content-Type");
    res.removeHeader("Content-Length");


    if (req.method === "HEAD") {
    	return res.sendStatus(204).end();  // IMPORTANT: no body for HEAD
  	}

    return res.status(204).end();

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
