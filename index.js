import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const LOG_DIR = "/tmp/logs";

// Ensure logs/tmp folder exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function todayDateString(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function appendLog(entryObj) {
  const filePath = path.join(LOG_DIR, `${todayDateString()}.txt`);
  const line = JSON.stringify(entryObj) + "\n";
  fs.appendFileSync(filePath, line);
}

app.get("/log", (req, res) => {
  const entry = {
    timestamp: new Date().toISOString(),
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    ua: req.headers["user-agent"],
  };

  appendLog(entry);

  res.json({ ok: true });
});

// REQUIRED EXPORT FOR VERCEL
export default app;
