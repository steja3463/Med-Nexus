// /* eslint-disable no-unused-vars */
// // import React from 'react'


import { useContext, useEffect } from "react";
import { Auth } from "../Contexts/AuthContext";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { Bell, Calendar, CircleArrowRightIcon, LayoutDashboardIcon, LayoutIcon, ListChecks, Pill, Stethoscope, User, UserPlus } from "lucide-react";


const HomePage = () => {
  const { role } = useContext(Auth);
  const { user } = useContext(Auth);
  const nav = useNavigate();

  useEffect(() => {
    if (user === null || role == null) {
      nav("/");
    }
  }, [user, role, nav]);

  const NavItems = {
    "Patient": [
      { id: 1, name: "Dashboard", icon: LayoutIcon, link: "patient" },
      { id: 2, name: "Book Appointments", icon: CircleArrowRightIcon, link: "patient/bookAppointment" },
      { id: 3, name: "Your Prescriptions", icon: Pill, link: "patient/getPrescriptions" },
      { id: 4, icon: ListChecks, name: "Status of Booking", link: "patient/status" }
    ],
    "Doctor": [
      { id: 1, name: "Dashboard", icon: LayoutDashboardIcon, link: "doctor" },
      { id: 2, name: "Add Prescription", icon: Pill, link: "doctor/getAppointments" },
      { id: 3, name: "Your Appointments", icon: Calendar, link: "doctor/getAppointments" },
      { id: 4, name: "Your Profile", icon: User, link: "doctor/profile" }
    ],
    "Admin": [
      { id: 1, name: "Dashboard", icon: LayoutDashboardIcon, link: "admin" },
      { id: 2, name: "Add Doctor", icon: Stethoscope, link: "admin/addDoctor" },
      { id: 3, name: "Add Admin", icon: UserPlus, link: "admin/addAdmin" },
      { id: 4, name: "Notifications", icon: Bell, link: "admin/notifications" }
    ]
  };

  const items = NavItems[role];
  console.log(items);

  return (
    <div className="flex">
      <div className="border shadow-2xl w-[25%] min-h-screen p-5 bg-slate-200">
        <hr className="my-5 shadow-2xl"></hr>
        {items.map((nav) => (
          <Link
            to={nav.link}
            key={nav.id}
            className="flex items-center gap-3 text-md p-4 text-black hover:bg-slate-100 hover:text-blue-500 cursor-pointer rounded-lg my-2"
          >
            <nav.icon className="w-6 h-6" />
            <h2>{nav.name}</h2>
          </Link>
        ))}
      </div>
      <div className="flex-1 p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default HomePage;

