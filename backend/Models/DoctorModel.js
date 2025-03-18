const mongoose = require('mongoose');
const DoctorSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId, ref:'User', required:true
    },
    name: {
        type:String,
    },
    specialization : {
        type: String, required:true
    },
    costPerVisit: {
        type: Number, required:true
    }   
})

module.exports = mongoose.model('Doctor',DoctorSchema);
