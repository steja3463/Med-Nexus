const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
    patientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    doctorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Doctor", 
        required: true 
    },
    startTime: { 
        type: Date, 
        required: true, 
    },
    endTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected", "Completed"],
        default: "Pending",
    },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
