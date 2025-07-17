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
const symptomSpecializationMapping = require("../../../Models/symptomSpecializationMapping");
const Doctor = require("../../../Models/DoctorModel");

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

// Get all available symptoms
router.get("/symptoms", (req, res) => {
  const symptoms = symptomSpecializationMapping.map((item) => item.symptom);
  res.json(symptoms);
});

// Filter doctors by selected symptoms (multi-select)
router.post("/filterDoctorsBySymptoms", async (req, res) => {
  try {
    const { symptoms } = req.body; // array of symptoms
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: "No symptoms provided" });
    }
    // Find all specializations for the selected symptoms
    const specializations = [
      ...new Set(
        symptomSpecializationMapping
          .filter((item) => symptoms.includes(item.symptom))
          .flatMap((item) => item.specializations)
      ),
    ];
    if (specializations.length === 0) {
      return res.status(404).json({ message: "No specializations found for selected symptoms" });
    }
    // Find doctors with any of the specializations
    const doctors = await Doctor.find({ specialization: { $in: specializations } });
    res.json(doctors);
  } catch (error) {
    console.error("Error filtering doctors by symptoms:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
