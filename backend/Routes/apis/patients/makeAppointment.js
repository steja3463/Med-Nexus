const express = require("express");
const {
  bookAppointment,
  upDateAppointment,
  appointmentNotification,
  markAppointmentAsCompleted,
} = require("../../../Controllers/appointmentController");
const {
  authenticateJWT,
  checkRole,
} = require("../../../Middleware/authMiddleware");
const {
  getPrescription,
  getPrescriptionDetailsById,
} = require("../../../Controllers/prescriptionController");
const {
  getAllDoctors,
  getSingleDoctor,
} = require("../../../Controllers/doctorController");
const {
  getNotifications,
  markNotificationAsRead,
} = require("../../../Controllers/notificationController");

const router = express.Router();
router.post(
  "/bookAppointment",
  authenticateJWT,
  checkRole("isPatient"),
  bookAppointment
);
router.post(
  "/updateAppointment",
  authenticateJWT,
  checkRole("isAdmin"),
  upDateAppointment
);
router.get(
  "/getPrescription",
  authenticateJWT,
  checkRole("isPatient"),
  getPrescription
);
router.get(
  "/getPrescriptionsById/:id",
  authenticateJWT,
  checkRole("isPatient"),
  getPrescriptionDetailsById
);
router.get("/getDoctors", getAllDoctors);
router.get("/doctors/:id", getSingleDoctor);
router.get(
  "/getAppointmentsForAdmin",
  authenticateJWT,
  checkRole("isAdmin"),
  appointmentNotification
);
router.get(
  "/getStatus",
  authenticateJWT,
  checkRole("isPatient"),
  getNotifications
);
router.post(
  "/markAsSeen/:id",
  authenticateJWT,
  checkRole("isPatient"),
  markNotificationAsRead
);
router.put(
  "/markAsCompleted/:id",
  authenticateJWT,
  checkRole("isDoctor"),
  markAppointmentAsCompleted
);

module.exports = router;
