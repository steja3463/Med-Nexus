/* eslint-disable react/prop-types */
import React from "react";
import avatar from "../assets/doc-avatar.avif";
import { useNavigate } from "react-router-dom";

const Card = ({ doctor }) => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate(`/dashboard/patient/bookAppointment/${doctor._id}`);
  };
  return (
    
      <div className="m-3 w-96 h-auto bg-slate-200 flex justify-around items-center leading-8 rounded-md shadow-2xl">
        <div className="w-36 h-40">
          <img className="p-3 rounded-full mr-12 mt-2" src={avatar} alt="Doctor Avatar" />
        </div>
        <div>
          <div className="mt-2">
            <div className="flex text-sm">
              <p className="font-bold">Name</p>
              <p> : {doctor.name}</p>
            </div>
            <div className="flex text-sm">
              <p className="font-bold">Specialization</p>
              <p> : {doctor.specialization}</p>
            </div>
            <div className="flex text-sm">
              <p className="font-bold">Cost-Per-Booking</p>
              <p> : ₹{doctor.costPerVisit}</p>
            </div>
          </div>
          <button className="shadow-lg mt-4 hover:bg-blue-800 w-44 h-9 bg-blue-500 rounded-full text-white text-xs font-medium" onClick={handleBookAppointment}>
            Book Appointment
          </button>
        </div>
      </div>
    
  );
};

export default Card;
