const express = require("express");
const {
  authenticateJWT,
  checkRole,
} = require("../../../Middleware/authMiddleware");
const {
  addDoctor,
  getProfile,
  getAppointments,
} = require("../../../Controllers/doctorController");
const {
  getNotifications,
  markNotificationAsRead,
} = require("../../../Controllers/notificationController");
const {
  addPrescription,
} = require("../../../Controllers/prescriptionController");
const router = express.Router();

router.post("/addDoc", authenticateJWT, checkRole("isAdmin"), addDoctor);
router.get("/profile", authenticateJWT, checkRole("isDoctor"), getProfile);
router.get(
  "/allNotifications",
  authenticateJWT,
  checkRole("isDoctor"),
  getNotifications
);
router.get(
  "/read/:id",
  authenticateJWT,
  checkRole("isDoctor"),
  markNotificationAsRead
);
router.post(
  "/addPrescription/:id",
  authenticateJWT,
  checkRole("isDoctor"),
  addPrescription
);
router.get(
  "/getAppointments",
  authenticateJWT,
  checkRole("isDoctor"),
  getAppointments
);

module.exports = router;
