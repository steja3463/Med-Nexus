import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import Home from "./Components/Home";
import Signup from "./Pages/Signup";
import HomePage from "./Pages/HomePage";
import Footer from "./Components/Footer";

import BookAppointment from "./Components/BookAppointment";
import Prescriptions from "./Components/Prescriptions";
import ViewDoctor from "./Components/ViewDoctor";
import AddDoctor from "./Components/AddDoctor";
import NotificationAdmin from "./Components/NotificationAdmin";
import AddPrescription from "./Components/AddPrescription";
import AddAdmin from "./Components/AddAdmin";
import AdminDashboard from "./Components/AdminDashboard";
import PatientDashboard from "./Components/PatientDashboard";
import AdminLayout from "./Layouts/AdminLayout";
import ConfirmationStatus from "./Components/ConfirmationStatus";
import DoctorDashboard from "./Components/DoctorDashboard";
import YourAppointments from "./Components/YourAppointments";
import DoctorProfile from "./Components/DoctorProfile";
import ViewPrescription from "./Components/ViewPrescription";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import VideoCall from "./Components/VideoCall";
import ChatbotPlaceholder from "./Components/ChatbotPlaceholder";

function App() {
  return (
    <>
      <Routes>
        {/* Video call route needs to be outside the layout with Navbar and Footer */}
        <Route path="/video-call/:roomId" element={<VideoCall />} />

        {/* Routes with Navbar and Footer */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <hr className="bg-slate-400 h-[1px]" />
              <Home />
              <Footer />
            </>
          }
        />

        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <hr className="bg-slate-400 h-[1px]" />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<HomePage />}>
                  <Route path="admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="addDoctor" element={<AddDoctor />} />
                    <Route path="addAdmin" element={<AddAdmin />} />
                    <Route
                      path="notifications"
                      element={<NotificationAdmin />}
                    />
                  </Route>
                  <Route path="patient" element={<AdminLayout />}>
                    <Route index element={<PatientDashboard />} />
                    <Route
                      path="bookAppointment"
                      element={<BookAppointment />}
                    />
                    <Route
                      path="bookAppointment/:id"
                      element={<ViewDoctor />}
                    />
                    <Route
                      path="getPrescriptions"
                      element={<Prescriptions />}
                    />
                    <Route
                      path="viewPrescription/:id"
                      element={<ViewPrescription />}
                    />
                    <Route path="status" element={<ConfirmationStatus />} />
                    <Route path="chatbot" element={<ChatbotPlaceholder />} />
                  </Route>
                  <Route path="doctor" element={<AdminLayout />}>
                    <Route index element={<DoctorDashboard />} />
                    <Route
                      path="addPrescription/:id"
                      element={<AddPrescription />}
                    />
                    <Route
                      path="getAppointments"
                      element={<YourAppointments />}
                    />
                    <Route path="profile" element={<DoctorProfile />} />
                  </Route>
                </Route>
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
