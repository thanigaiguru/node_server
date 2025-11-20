import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3000;
const LOG_DIR = path.join(__dirname, 'logs');


// Ensure logs directory exists
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
const fileName = `${todayDateString()}.txt`;
const filePath = path.join(LOG_DIR, fileName);
const line = JSON.stringify(entryObj) + "\n";
fs.appendFile(filePath, line, (err) => {
if (err) console.error('Log write failed:', err);
});
}


// Main API
app.get('/log', (req, res) => {
const now = new Date();
const entry = {
timestamp: now.toISOString(),
ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
userAgent: req.headers['user-agent'],
path: req.originalUrl,
method: req.method,
query: req.query,
acceptLanguage: req.headers['accept-language'] || null
};


appendLog(entry);
res.json({ ok: true, recorded: entry.timestamp });
});


app.get('/health', (req, res) => res.send('ok'));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));