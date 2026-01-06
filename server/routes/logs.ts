import { RequestHandler } from "express";
import path from "path";
import fs from "fs";

export const handleGetLogs: RequestHandler = (req, res) => {
  const logPath = path.join(process.cwd(), "logs", "TC1~4_Round1_data.json");
  
  if (fs.existsSync(logPath)) {
      res.sendFile(logPath);
  } else {
      res.status(404).json({ error: "Log file not found at " + logPath });
  }
};
