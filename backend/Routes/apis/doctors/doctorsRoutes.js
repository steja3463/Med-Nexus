const express = require('express');
const { authentcateJWT, checkRole } = require('../../../Middleware/authMiddleware');
const {addDoctor,getProfile, getAppointments} = require('../../../Controllers/doctorController');
const { getNotifications, markNotificationAsRead } = require('../../../Controllers/notificationController');
const { addPrescription } = require('../../../Controllers/prescriptionController');
const router = express.Router();

router.post('/addDoc',authentcateJWT,checkRole('isAdmin'),addDoctor);
router.get('/profile',authentcateJWT,checkRole('isDoctor'),getProfile)
router.get('/allNotifications',authentcateJWT,checkRole('isDoctor'),getNotifications);
router.get('/read/:id',authentcateJWT,checkRole('isDoctor'),markNotificationAsRead)
router.post('/addPrescription/:id',authentcateJWT,checkRole('isDoctor'),addPrescription);  
router.get('/getAppointments',authentcateJWT,checkRole('isDoctor'),getAppointments);

module.exports = router