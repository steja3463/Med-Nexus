import React, { useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import { Auth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const TodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initiatingCall, setInitiatingCall] = useState(null);
  const { user } = useContext(Auth);
  const nav = useNavigate();

  // Use environment variable or a config file for API URL
  const API_URL = "http://localhost:3000";

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/getAppointments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.status}`);
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrescription = (id) => {
    nav(`/dashboard/doctor/addPrescription/${id}`);
  };

  const handleMarkAsCompleted = async (id) => {
    try {
      console.log("User Token:", user);

      const response = await fetch(`${API_URL}/markAsCompleted/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to mark appointment as completed: ${response.status}`
        );
      }

      fetchAppointments();
    } catch (error) {
      console.error("Error marking appointment as completed:", error);
      alert("Failed to mark appointment as completed. Please try again.");
    }
  };

  const initiateVideoCall = async (patientId, appointmentId) => {
    try {
      setInitiatingCall(appointmentId);

      const roomId = `appointment-${appointmentId}`;
      const response = await fetch(`${API_URL}/initiateVideoCall`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: JSON.stringify({
          patientId,
          appointmentId,
          roomId,
          role: "doctor",
        }),
      });

      if (response.ok) {
        throw new Error(`Failed to initiate video call: ${response.status}`);
      }
      nav(`/video-call/${roomId}`);
    } catch (error) {
      console.error("Error initiating video call:", error);
      alert("Could not connect to video call service. Please try again later.");
    } finally {
      setInitiatingCall(null);
    }
  };

  const formatDateTime = (dateTimeString) => {
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return "Invalid date";

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;

      return `${day}/${month}/${year} at ${hours}:${minutes} ${ampm}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Date error";
    }
  };

  const isAppointmentActive = (appointment) => {
    try {
      const now = new Date();
      const startTime = new Date(appointment.startTime);
      if (isNaN(startTime.getTime())) return false;

      // Allow joining 15 minutes before appointment
      const bufferStartTime = new Date(startTime.getTime() - 15 * 60000);

      // Default end time is 30 minutes after start if not specified
      let endTime = appointment.endTime
        ? new Date(appointment.endTime)
        : new Date(startTime.getTime() + 30 * 60000);

      if (isNaN(endTime.getTime())) {
        endTime = new Date(startTime.getTime() + 30 * 60000);
      }

      return (
        now >= bufferStartTime &&
        now <= endTime &&
        appointment.status !== "Completed"
      );
    } catch (error) {
      console.error("Error checking if appointment is active:", error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();

      // Refresh appointments every minute
      const intervalId = setInterval(() => {
        fetchAppointments();
      }, 60000);

      return () => clearInterval(intervalId);
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={fetchAppointments}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Today's Appointments</h1>
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={fetchAppointments}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {appointments.length === 0 ? (
        <p className="text-center py-8 text-gray-500">
          No appointments scheduled for today.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((appointment) => {
            const isActive = isAppointmentActive(appointment);
            return (
              <div
                key={appointment._id}
                className={`p-4 border rounded-lg shadow-lg ${
                  isActive ? "bg-green-50 border-green-200" : "bg-white"
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Patient:{" "}
                      {appointment.patientId?.userName || "Unknown Patient"}
                    </h2>
                    <p className="text-gray-700">
                      <span className="font-medium">Time:</span>{" "}
                      {formatDateTime(appointment.startTime)}
                    </p>
                    {appointment.endTime && (
                      <p className="text-gray-700">
                        <span className="font-medium">End:</span>{" "}
                        {formatDateTime(appointment.endTime)}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Status: {appointment.status || "Scheduled"}
                      {isActive && !appointment.status && " (Active Now)"}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    {isActive && (
                      <button
                        onClick={() =>
                          initiateVideoCall(
                            appointment.patientId._id,
                            appointment._id
                          )
                        }
                        disabled={initiatingCall === appointment._id}
                        className={`${
                          initiatingCall === appointment._id
                            ? "bg-purple-400 cursor-wait"
                            : "bg-purple-600 hover:bg-purple-700"
                        } text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full sm:w-auto`}
                      >
                        {initiatingCall === appointment._id
                          ? "Connecting..."
                          : "Start Video Call"}
                      </button>
                    )}
                    <button
                      onClick={() =>
                        handleAddPrescription(appointment.patientId._id)
                      }
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
                    >
                      Add Prescription
                    </button>
                    {appointment.status !== "Completed" && (
                      <button
                        onClick={() => handleMarkAsCompleted(appointment._id)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TodayAppointments;
