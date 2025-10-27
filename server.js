import express from "express";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Ensure upload folder exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// ----------------------
// 🌍 LOCATION ENDPOINT
// ----------------------
app.post("/location", (req, res) => {
  const { latitude, longitude, timestamp } = req.body;
  if (!latitude || !longitude) return res.status(400).send("Invalid location");

  io.emit("locationUpdate", { latitude, longitude, timestamp });
  console.log(`📍 Location received: ${latitude}, ${longitude}`);
  res.sendStatus(200);
});

// ----------------------
// 🎤 AUDIO ENDPOINT
// ----------------------
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, `audio_${Date.now()}.3gp`)
});
const upload = multer({ storage });

app.post("/audio", upload.single("audio"), (req, res) => {
  const audioPath = `/uploads/${req.file.filename}`;
  io.emit("audioUpdate", { url: audioPath });
  console.log(`🎧 Audio uploaded: ${audioPath}`);
  res.sendStatus(200);
});

// ----------------------
// 🔌 SOCKET.IO
// ----------------------
io.on("connection", (socket) => {
  console.log("🟢 Parent connected to dashboard");
});

// ----------------------
// 🚀 START SERVER
// ----------------------
server.listen(PORT, () => {
  console.log(`✅ Guardian Parent Server running on http://localhost:${PORT}`);
});
