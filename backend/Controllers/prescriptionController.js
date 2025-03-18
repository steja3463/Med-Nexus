// //http:localhost:3000/doctor/addPrescription/{id}




const PrescriptionModel = require("../Models/PrescriptionModel");

const addPrescription = async (req, res) => {
    try {
        const patientId = req.params.id; 
        console.log(patientId);
        const doctorId = req.user._id; 
        console.log(doctorId);
        const {patientName,medicines, dosages, cause } = req.body; 
        const prescription = new PrescriptionModel({
            patientId,
            doctorId,
            patientName,
            medicines,
            dosages,
            cause,
            issuedOn : new Date().toLocaleDateString()
        });
        await prescription.save();
        return res.status(200).json({ "message": "Prescription is Added" });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const getPrescription = async (req, res) => {
    try {
        const patientId = req.user._id; // Access req.user directly
        const getPres = await PrescriptionModel.find({ patientId }).populate('doctorId','specialization');
        if (!getPres.length) { // Check if there are no prescriptions
            return res.status(403).json("No prescriptions Found");
        }
        return res.status(200).json(getPres);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const getPrescriptionDetailsById = async (req, res) => {
    try {
        const id = req.params.id;
        const getPres = await PrescriptionModel.findById(id)
        if (!getPres) { 
            return res.status(403).json("No prescription found");
        }
        return res.status(200).json(getPres);
    } catch (error) {
        return res.status(500).json({ error });
    }
}

module.exports = { addPrescription, getPrescription, getPrescriptionDetailsById };

