const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");
const e = require("express");

require("dotenv").config();

const addAdmin = async (req, res) => {
  try {
    const { userName, password, email } = req.body;
    const user = await UserModel.findOne({ userName });
    const hash = await bcrypt.hash(password, 10);
    if (user) return res.status(400).json({ msg: "User already exists" });
    const newUser = new UserModel({
      userName,
      password: hash,
      email,
      roles: { isAdmin: true },
    });
    await newUser.save();
    res.json({ message: "Admin added successfully" });
  } catch (error) {
    res.status(500).json({ message: "admin is not added !!" });
  }
};

const register = async (req, res) => {
  try {
    const { userName, password, email, roles } = await req.body;

    const userExists = await UserModel.findOne({ userName });
    if (userExists) {
      return res.status(500).json({ message: "Username already Exists" });
    }

    console.log("user", userName, password, email, roles);

    const hash = await bcrypt.hash(password, 10);
    const user = new UserModel({ userName, password: hash, email, roles });
    await user.save();
    res.status(200).json({ user, message: "User is added sucessfully" });
  } catch (error) {
    res.status(500).json({ message: "User is not added !!" });
  }
};

const login = async (req, res) => {
  try {
    const { userName, password, roles } = await req.body;
    // console.log(userName,password);
    const user = await UserModel.findOne({ userName });
    // console.log(user?.password);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const userRole = user.roles;
    const roleMatch =
      (roles.isAdmin && userRole.isAdmin) ||
      (roles.isPatient && userRole.isPatient) ||
      (roles.isDoctor && userRole.isDoctor);

    if (!roleMatch) {
      return res.status(400).json({ message: "Role mismatch" });
    }
    const token = jwt.sign(
      { _id: user._id, roles: user.roles },
      process.env.JWT_SECRET
    );
    let r;
    if (userRole.isDoctor) {
      r = "Doctor";
    } else if (userRole.isAdmin) {
      r = "Admin";
    } else {
      r = "Patient";
    }
    res.status(200).json({ token, r });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = { register, login, addAdmin };
