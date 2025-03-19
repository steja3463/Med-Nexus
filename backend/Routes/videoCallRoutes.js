// Add these routes to your Express server

const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../Middleware/authMiddleware"); // Adjust path as needed
const Appointment = require("../Models/AppointmentModel"); // Adjust path as needed
const User = require("../Models/UserModel"); // Adjust path as needed
const WebSocket = require("ws");

// Initialize WebSocket server
const initializeWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  // Store active connections by room
  const rooms = new Map();

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      const data = JSON.parse(message);
      const { type, roomId } = data;

      switch (type) {
        case "join":
          // Add user to room
          if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
          }
          rooms.get(roomId).add(ws);

          // Notify others in the room
          rooms.get(roomId).forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "userJoined",
                })
              );
            }
          });
          break;

        case "callUser":
          // Forward call request to others in room
          rooms.get(roomId)?.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "callUser",
                  from: data.from,
                  signal: data.signalData,
                })
              );
            }
          });
          break;

        case "answerCall":
          // Forward call acceptance to others in room
          rooms.get(roomId)?.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "callAccepted",
                  signal: data.signal,
                })
              );
            }
          });
          break;

        case "endCall":
          // Notify others that call has ended
          rooms.get(roomId)?.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "callEnded",
                })
              );
            }
          });
          break;

        default:
          break;
      }
    });

    ws.on("close", () => {
      // Remove connection from all rooms
      rooms.forEach((clients, roomId) => {
        if (clients.has(ws)) {
          clients.delete(ws);

          // Notify others in the room
          clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "userLeft",
                })
              );
            }
          });

          // Clean up empty rooms
          if (clients.size === 0) {
            rooms.delete(roomId);
          }
        }
      });
    });
  });
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

    // Check if current user is the doctor for this appointment
    if (appointment.doctorId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Create or update video call session
    appointment.videoCallRoomId = roomId;
    appointment.videoCallStatus = "initiated";
    await appointment.save();

    // Send notification to patient (you can implement this)
    // ...

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

      // Check if current user is either the doctor or patient
      const isDoctor = appointment.doctorId._id.toString() === req.user.id;
      const isPatient = appointment.patientId._id.toString() === req.user.id;

      if (!isDoctor && !isPatient) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Return appointment details with relevant info
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
