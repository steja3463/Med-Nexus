const AppointmentModel = require("../Models/AppointmentModel");
const DoctorModel = require("../Models/DoctorModel");
const NotificationModel = require("../Models/NotificationModel");
const UserModel = require("../Models/UserModel");
const moment = require('moment-timezone')

const bookAppointment =async (req,res) => {
    try {
        const {doctorId,startTime} = await req.body;
        const patientId = req.user._id;
        const doctor = await DoctorModel.findById(doctorId);
        if(!doctor) return res.status(403).json({"message":"Doctor Not found"});
        const startIST = moment.utc(startTime).tz('Asia/Kolkata').toDate();
        const endIST = moment(startIST).add(1, 'hours').toDate();
        
        const conflictAppointment = await AppointmentModel.findOne({
            doctorId:doctor.userId,
            startTime:{$lt:endIST},
            endTime:{$gt:startIST},
            status:'Approved'
        })
        if (conflictAppointment) {
            return res.status(400).json({ message: 'Time slot is already booked' });
        }
        const appointment = new AppointmentModel({
            patientId,
            doctorId:doctor.userId,
            startTime:startIST,
            endTime:endIST
        })
        await appointment.save();

        
        const name = doctor.name

        

        const patient = await UserModel.findById(patientId)
        const message = `Your are apppintment with ${name} is ${appointment.status}`
        const newNotification = new NotificationModel({
            userId:patientId,
            doctorId:doctorId,
            appointmentId: appointment._id,
            message
        })

        await newNotification.save()

        return res.status(200).json({"message":"Appointment Requested Sucessfully "})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
 

//In front end we will provide the button to accept or reject the appointment and from that we will issue
//the status of the appointment and will be sent notifcation to the user

// const upDateAppointment = async (req,res) => {
//     try {
//         const {appointMentId,status} = await req.body;
//         console.log(appointMentId+" "+status);
//         const appointment = await AppointmentModel.findById(appointMentId);
//         console.log(appointment);
//         if(!appointment) return res.status(403).json({"message":"Appointment Not found"});
//         appointment.status = status;
//         await appointment.save();
//         const patient  = await UserModel.findById(appointment.patientId)
//         const doctor = await DoctorModel.findById(appointment.doctorId)
//         const message = `Your appointment with ${doctor.userName} is ${status}`
//         const newNotification = new NotificationModel({
//             userId: appointment.patientId,
//             doctorId:appointment.doctorId,
//             message
//         })
//         await newNotification.save();
//         return res.status(200).json({"message":"Appointment Updated Sucessfully"})       
//     } catch (error) {
//         return res.status(500).json({error})
//     }

// }

// const upDateAppointment = async (req, res) => {
//     try {
//       const { appointMentId, status } = req.body;
//       console.log(appointMentId + " " + status);
//       const appointment = await AppointmentModel.findById(appointMentId);
//       console.log(appointment);
//       if (!appointment) return res.status(403).json({ "message": "Appointment Not found" });
//       appointment.status = status;
//       await appointment.save();
//       const patient = await UserModel.findById(appointment.patientId);
//       console.log(appointment.doctorId);
//       const doctor = await DoctorModel.findById(appointment.doctorId).populate('doctorId','userName');
//       console.log(doctor);
//       const message = `Your appointment with ${doctor.userName} is ${status}`;
//       const notification = await NotificationModel.findOne({ userId: appointment.patientId, doctorId: appointment.doctorId, appointmentId: appointment._id });
//       if (notification) {
//         notification.message = message;
//         await notification.save();
//       } 
//       return res.status(200).json({ "message": "Appointment Updated Successfully" });
//     } catch (error) {
//       return res.status(500).json({ error });
//     }
//   };

const upDateAppointment = async (req, res) => {
    try {
      const { appointMentId, status } = req.body;
      console.log(appointMentId + " " + status);
      const appointment = await AppointmentModel.findById(appointMentId).populate('doctorId', 'name');
      console.log(appointment);
  
      if (!appointment) {
        return res.status(403).json({ "message": "Appointment Not found" });
      }
  
      appointment.status = status;
      await appointment.save();
      const patient = await UserModel.findById(appointment.patientId);
      console.log(appointment.doctorId);
      const doctor = appointment.doctorId;
      console.log(doctor);
  
      const message = `Your appointment with ${doctor.name} is ${status}`;
  
      const notification = await NotificationModel.findOne({
        userId: appointment.patientId,
        doctorId: appointment.doctorId._id, 
        appointmentId: appointment._id
      });
  
      if (notification) {
        notification.message = message;
        await notification.save();
      }
  
      return res.status(200).json({ "message": "Appointment Updated Successfully" });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
  
  


const appointmentNotification = async(req,res) => {
    
    try {
        const appointments = await AppointmentModel.find({status:'Pending'})
            .populate('patientId', 'userName')
            .populate('doctorId', 'userName');
        return res.status(200).json(appointments);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
    
}


const markAppointmentAsCompleted = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const doctorId = req.user._id;

    const appointment = await AppointmentModel.findOneAndUpdate(
      { _id: appointmentId, doctorId },
      { status: "Completed" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or you are not authorized to update this appointment" });
    }

    res.status(200).json({ message: "Appointment marked as completed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports ={bookAppointment,upDateAppointment,appointmentNotification,markAppointmentAsCompleted}


