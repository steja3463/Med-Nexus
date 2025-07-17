const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToDb = require("./Config/connectToDb");
const authRoutes = require("./Routes/apis/authRoutes");
const doctorRoutes = require("./Routes/apis/doctors/doctorsRoutes");
const patientRoutes = require("./Routes/apis/patients/makeAppointment");
const {
  routes,
  initializeWebSocketServer,
} = require("./Routes/videoCallRoutes");

// Load environment variables
dotenv.config();

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// ✅ Initialize WebSocket server AFTER creating HTTP server
initializeWebSocketServer(server);

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json());

// Connect to Database
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
  console.log(`✅ Server is running on port ${PORT}`);
});
