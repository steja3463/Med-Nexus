const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");
const DoctorModel = require("../Models/DoctorModel");
const AppointmentModel = require("../Models/AppointmentModel");

const addDoctor = async (req, res) => {
  try {
    const { userName, password, email, specialization, csp } =
      await req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      userName,
      password: hashPassword,
      email,
      roles: {
        isDoctor: true,
      },
    });
    await newUser.save();
    const newDoc = new DoctorModel({
      _id: newUser._id,
      userId:newUser._id,
      name:userName,
      specialization,
      costPerVisit:csp,
    });
    await newDoc.save();
    return res.status(200).json({ message: "Added Doctor succesfully" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const getDocs = await DoctorModel.find({}).populate(
      "userId",
      "userName email"
    );
    return res.status(200).json({ getDocs });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getSingleDoctor = async (req, res) => {
  try {
    const { id } = await req.params;
    // console.log(id);
    const getDoc = await DoctorModel.findOne({ _id: id }).populate(
      "userId",
      "userName email"
    );
    return res.status(200).json({ getDoc });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getProfile = async (req, res) => {
  try {
    // console.log(req.user._id);
    const getDoc = await DoctorModel.findOne({ userId: req.user._id });
    // console.log(getDoc);
    if (!getDoc) {
      return res.status(400).json({ message: "Doctor Not found" });
    }
    return res.status(200).json({ getDoc });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id;
    console.log(doctorId);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    console.log(today);
    const tomorrowIST = new Date(today);
    tomorrowIST.setDate(today.getDate() + 2);
    console.log(tomorrowIST);
    const appointments = await AppointmentModel.find({
      doctorId,
      status: "Accepted",
      startTime: {
        $gte: today,
        $lt: tomorrowIST,
      },
    }).populate("patientId", "userName");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addDoctor,
  getProfile,
  getAllDoctors,
  getSingleDoctor,
  getAppointments,
};
