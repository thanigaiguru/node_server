// export default function handler(req, res) {
//   res.status(200).json({ message: "Hello from Vercel API" });
// }


import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // ---- 1. Prepare log filename by date
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const logFile = path.join("/tmp", `log-${today}.txt`);

    // ---- 2. Collect request info
    const logData = {
      time: new Date().toISOString(),
      method: req.method,
      url: req.url,
      userAgent: req.headers["user-agent"] || "",
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    };

    // ---- 3. Format as log line
    const line = JSON.stringify(logData) + "\n";

    // ---- 4. Append log file
    fs.appendFileSync(logFile, line, "utf8");

    // ---- 5. Return API response
    res.status(200).json({
      message: "Hello from Vercel API",
      logged: true,
    });

  } catch (err) {
    console.error("Log write failed:", err);

    res.status(500).json({
      error: "Logging failed",
    });
  }
}
