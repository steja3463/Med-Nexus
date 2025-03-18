const mongoose = require('mongoose');
const notificationSchema = mongoose.Schema({
    userId:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
    },
    doctorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Doctor", 
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
    },
    message: {
        type:String,
        required:true,
    },
    markAsRead: {
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("Notification",notificationSchema)