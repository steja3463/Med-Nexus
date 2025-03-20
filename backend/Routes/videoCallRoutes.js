// videoCallRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../Middleware/authMiddleware");
const Appointment = require("../Models/AppointmentModel");
const User = require("../Models/UserModel");
const WebSocket = require("ws");
const { Server } = require("ws");

let users = {};
// Initialize WebSocket server
const initializeWebSocketServer = (server) => {
  const wss = new Server({ server });

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      const data = JSON.parse(message);

      if (data.type === "register") {
        users[data.userId] = ws; // Store user's WebSocket connection
      }

      if (data.type === "call") {
        const { receiverId } = data;
        if (users[receiverId]) {
          users[receiverId].send(JSON.stringify({ type: "incomingCall", callerId: data.callerId }));
        }
      }

      if (data.type === "acceptCall") {
        const { callerId } = data;
        if (users[callerId]) {
          users[callerId].send(JSON.stringify({ type: "callAccepted" }));
        }
      }

      if (data.type === "signal") {
        const { target, signal } = data;
        if (users[target]) {
          users[target].send(JSON.stringify({ type: "signal", signal }));
        }
      }
    });

    ws.on("close", () => {
      Object.keys(users).forEach((userId) => {
        if (users[userId] === ws) {
          delete users[userId];
        }
      });
    });
  });

  console.log("WebSocket server initialized");
};

// API endpoint to initiate a video call
router.post("/initiateVideoCall", authenticateJWT, async (req, res) => {
  try {
    const { patientId, appointmentId, roomId } = req.body;

    // Validate appointment exists and belongs to the doctor
    const appointment = await Appointment.findById(appointmentId)
      .populate("patientId")
      .populate("doctorId");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Use req.user._id to compare
    if (appointment.doctorId._id.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Create or update video call session in appointment
    appointment.videoCallRoomId = roomId;
    appointment.videoCallStatus = "initiated";
    await appointment.save();

    res.status(200).json({
      message: "Video call initiated successfully",
      roomId,
    });
  } catch (error) {
    console.error("Error initiating video call:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// API endpoint to get appointment details by room ID
router.get(
  "/getAppointmentByRoom/:roomId",
  authenticateJWT,
  async (req, res) => {
    try {
      const { roomId } = req.params;

      // Find appointment by room ID
      const appointment = await Appointment.findOne({ videoCallRoomId: roomId })
        .populate("patientId")
        .populate("doctorId");

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      // Use req.user._id for comparison
      const isDoctor = appointment.doctorId._id.toString() === req.user._id;
      const isPatient = appointment.patientId._id.toString() === req.user._id;

      if (!isDoctor && !isPatient) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      res.status(200).json({
        appointmentId: appointment._id,
        patientName: appointment.patientId.userName,
        doctorName: appointment.doctorId.userName,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        isDoctor,
        status: appointment.status,
      });
    } catch (error) {
      console.error("Error getting appointment:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = {
  routes: router,
  initializeWebSocketServer,
};
