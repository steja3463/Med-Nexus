const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../Middleware/authMiddleware");
const Appointment = require("../Models/AppointmentModel");
const WebSocket = require("ws");

// ✅ Fix WebSocket Disconnection Issue
const initializeWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });
  const rooms = new Map();

  console.log("✅ WebSocket Server Initialized");

  wss.on("connection", (ws) => {
    console.log("🔌 WebSocket Client Connected");

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        const { type, roomId } = data;

        if (!roomId) {
          console.error("❌ Missing roomId in WebSocket message");
          return;
        }

        console.log(`📩 Message received: ${type} for room ${roomId}`);

        switch (type) {
          case "join":
            ws.send(JSON.stringify({ type: "joined", roomId }));
            break;
          default:
            console.log("❌ Unknown WebSocket message type:", type);
        }
      } catch (error) {
        console.error("❌ WebSocket Error:", error);
      }
    });

    ws.on("close", () => {
      console.log("❌ WebSocket Disconnected");
    });
  });
};

// ✅ Fix API Route Authentication
router.get(
  "/getAppointmentByRoom/:roomId",
  authenticateJWT,
  async (req, res) => {
    try {
      const { roomId } = req.params;
      console.log("🔍 Searching for room:", roomId);

      const appointment = await Appointment.findOne({ videoCallRoomId: roomId })
        .populate("patientId")
        .populate("doctorId");

      if (!appointment) {
        return res.status(404).json({ message: "❌ Appointment not found" });
      }

      res.status(200).json({
        appointmentId: appointment._id,
        patientName: appointment.patientId.userName,
        doctorName: appointment.doctorId.userName,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
      });
    } catch (error) {
      console.error("❌ Server error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = { initializeWebSocketServer, routes: router };
