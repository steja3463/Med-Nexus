import React, { useState, useEffect, useContext } from "react";
import { Bell, Check, CircleX } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Auth } from "../Contexts/AuthContext";

const NotificationAdmin = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const {user} = useContext(Auth)

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3000/getAppointmentsForAdmin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      console.log(data);
      setAppointments(data);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching appointments');
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const response = await fetch(`http://localhost:3000/updateAppointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user}`,
        },
        body: JSON.stringify({ appointMentId: appointmentId, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }

      // Update the local state to remove the updated appointment
      setAppointments(appointments.filter(app => app._id !== appointmentId));
      toast.success(`Appointment ${status} successfully`);
    } catch (error) {
      console.error(error);
      toast.error('Error updating appointment status');
    }
  };

  return (
    <div className="m-5">
      <h1 className="text-left font-semibold text-2xl flex gap-3 items-center">
        Notifications <Bell />
      </h1>
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div key={appointment._id} className="h-16 flex justify-between items-center rounded-lg gap-8 mt-4 bg-slate-200">
            <p className="ml-4">
              Notification received by {appointment.patientId.userName} to the doctor at time: {new Date(appointment.startTime).toUTCString()}
            </p>
            <div className="flex gap-6 mr-8">
              <button
                className="flex w-28 p-1 hover:bg-green-500 bg-green-300 text-slate-900 justify-around items-center rounded-2xl"
                onClick={() => updateAppointmentStatus(appointment._id, 'Accepted')}
              >
                Accept <Check />
              </button>
              <button
                className="flex w-28 p-1 bg-red-300 hover:bg-red-500 justify-around items-center rounded-2xl"
                onClick={() => updateAppointmentStatus(appointment._id, 'Rejected')}
              >
                Reject <CircleX />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No notifications found</p>
      )}
      <hr className="bg-slate-400 h-[2px] mt-6" />
      <ToastContainer />
    </div>
  );
};

export default NotificationAdmin;
