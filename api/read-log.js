import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const logFile = path.join("/tmp", `log-${today}.txt`);

    if (!fs.existsSync(logFile)) {
      return res.status(404).json({ error: "No logs yet" });
    }

    const logs = fs.readFileSync(logFile, "utf8");
    res.status(200).send(logs);

  } catch (error) {
    res.status(500).json({ error: "Failed to read logs" });
  }
}
