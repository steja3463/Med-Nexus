const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const connectToDb = require("./Config/connectToDb"); // Ensure correct path
const authRoutes = require("./Routes/apis/authRoutes");
const doctorRoutes = require("./Routes/apis/doctors/doctorsRoutes");
const patientRoutes = require("./Routes/apis/patients/makeAppointment");
const {
  routes,
  initializeWebSocketServer,
} = require("./Routes/videoCallRoutes");

require("dotenv").config();

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
initializeWebSocketServer(server);

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Call only `connectToDb()`, remove duplicate `mongoose.connect()`
connectToDb();

// Routes
app.get("/", (req, res) => {
  res.send("Server is running...");
});
app.use("/", authRoutes);
app.use("/", doctorRoutes);
app.use("/", patientRoutes);
app.use("/", routes); // Adding WebSocket routes

// Start HTTP server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
