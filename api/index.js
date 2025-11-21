import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const logFile = path.join("/tmp", `log-${today}.txt`);

    const entry = {
      timestamp: new Date().toISOString(),
      userAgent: req.headers["user-agent"],
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      path: req.url,
      query: req.query
    };

    fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");
    res.status(200).json({ success: true, logged: today });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
