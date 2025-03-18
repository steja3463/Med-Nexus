const express = require('express');
const {bookAppointment,upDateAppointment, appointmentNotification, markAppointmentAsCompleted} = require('../../../Controllers/appointmentController');
const { authentcateJWT, checkRole } = require('../../../Middleware/authMiddleware');
const { getPrescription, getPrescriptionDetailsById } = require('../../../Controllers/prescriptionController');
const { getAllDoctors, getSingleDoctor } = require('../../../Controllers/doctorController');
const { getNotifications, markNotificationAsRead } = require('../../../Controllers/notificationController');


const router = express.Router();
router.post('/bookAppointment',authentcateJWT,checkRole('isPatient'),bookAppointment);
router.post('/updateAppointment',authentcateJWT,checkRole('isAdmin'),upDateAppointment);
router.get('/getPrescription',authentcateJWT,checkRole('isPatient'),getPrescription)
router.get('/getPrescriptionsById/:id', authentcateJWT,checkRole('isPatient'),getPrescriptionDetailsById)
router.get('/getDoctors',getAllDoctors)
router.get('/doctors/:id',getSingleDoctor)
router.get('/getAppointmentsForAdmin',authentcateJWT,checkRole('isAdmin'),appointmentNotification)
router.get('/getStatus',authentcateJWT,checkRole('isPatient'),getNotifications)
router.post('/markAsSeen/:id',authentcateJWT,checkRole('isPatient'),markNotificationAsRead)
router.put("/markAsCompleted/:id",authentcateJWT,checkRole('isDoctor'),markAppointmentAsCompleted)

module.exports = router