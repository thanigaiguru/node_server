// index.js
// Simple Node/Express server with one GET API that logs requests into date-wise text files
// Usage:
// 1. npm init -y
// 2. npm install express
// 3. node index.js

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_DIR = process.env.LOG_DIR || path.join(__dirname, 'logs');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Helper: return YYYY-MM-DD for today
function todayDateString(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Helper: append a log line to today's file
function appendLog(entryObj) {
  const fileName = `${todayDateString()}.txt`;
  const filePath = path.join(LOG_DIR, fileName);
  // Store one JSON object per line (newline-delimited JSON)
  const line = JSON.stringify(entryObj) + '\n';
  fs.appendFile(filePath, line, (err) => {
    if (err) {
      console.error('Failed to append log:', err);
    }
  });
}

// Single GET API: /log (you can change the path if you want)
// It will always respond quickly with 200 and record basic info in the log file
app.get('/log', (req, res) => {
  const now = new Date();
  const entry = {
    timestamp: now.toISOString(),
    ip: req.ip || req.connection?.remoteAddress || null,
    method: req.method,
    path: req.originalUrl,
    userAgent: req.get('User-Agent') || null,
    acceptLanguage: req.get('Accept-Language') || null,
    query: req.query || {},
  };

  appendLog(entry);

  // Minimal response so caller knows it's recorded
  res.status(200).json({ ok: true, recorded: { timestamp: entry.timestamp } });
});

// Optional health endpoint
app.get('/health', (req, res) => res.send('ok'));

app.listen(PORT, () => {
  console.log(`Logger server listening on port ${PORT}`);
  console.log(`Logs folder: ${LOG_DIR}`);
});
