import React, { useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import { Auth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const TodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initiatingCall, setInitiatingCall] = useState(null); // Track which call is being initiated
  const { user } = useContext(Auth);
  const nav = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:3000/getAppointments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user}`,
      },
    });
    const data = await response.json();
    setAppointments(data);
    setLoading(false);
  };

  const handleAddPrescription = (id) => {
    nav(`/dashboard/doctor/addPrescription/${id}`);
  };

  const handleMarkAsCompleted = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/markAsCompleted/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user}`,
          },
        }
      );
      if (response.ok) {
        fetchAppointments();
      } else {
        console.error("Failed to mark appointment as completed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const initiateVideoCall = async (patientId, appointmentId) => {
    try {
      setInitiatingCall(appointmentId); // Set loading state for this specific appointment

      // Generate a unique room ID based on appointment ID
      const roomId = `appointment-${appointmentId}`;

      // Create or update video call session in your backend
      const response = await fetch("http://localhost:3000/initiateVideoCall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: JSON.stringify({
          patientId,
          appointmentId,
          roomId,
        }),
      });

      if (response.ok) {
        // Navigate to video call room
        nav(`/video-call/${roomId}`);
      } else {
        const errorData = await response.json();
        alert(
          `Failed to initiate video call: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error initiating video call:", error);
      alert("Could not connect to video call service. Please try again.");
    } finally {
      setInitiatingCall(null); // Reset loading state regardless of outcome
    }
  };

  // Format date and time in a consistent way
  const formatDateTime = (dateTimeString) => {
    try {
      const date = new Date(dateTimeString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      // Format date: DD/MM/YYYY
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      // Format time: HH:MM AM/PM
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12

      return `${day}/${month}/${year} at ${hours}:${minutes} ${ampm}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Date error";
    }
  };

  // Check if appointment is currently active (within time slot)
  const isAppointmentActive = (appointment) => {
    try {
      const now = new Date();
      const startTime = new Date(appointment.startTime);

      // Check if the date is valid before proceeding
      if (isNaN(startTime.getTime())) {
        console.error("Invalid start time:", appointment.startTime);
        return false;
      }

      // Add buffer time (15 minutes before appointment)
      const bufferStartTime = new Date(startTime.getTime() - 15 * 60000);

      // Handle end time, with fallback if not present
      let endTime;
      if (
        appointment.endTime &&
        !isNaN(new Date(appointment.endTime).getTime())
      ) {
        endTime = new Date(appointment.endTime);
      } else {
        // Default 30 min if no valid end time
        endTime = new Date(startTime.getTime() + 30 * 60000);
      }

      return now >= bufferStartTime && now <= endTime;
    } catch (error) {
      console.error("Error checking if appointment is active:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchAppointments();
    // Set up an interval to refresh appointments every minute
    const intervalId = setInterval(() => {
      fetchAppointments();
    }, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [user]);

  if (loading) {
    return <Loading />;
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
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
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
                className={`p-4 border rounded shadow-lg ${
                  isActive ? "bg-green-50 border-green-200" : "bg-white"
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Patient: {appointment.patientId.userName}
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
                    <p
                      className={`text-sm ${
                        appointment.status === "Completed"
                          ? "text-green-600"
                          : isActive
                          ? "text-blue-600 font-semibold"
                          : "text-gray-600"
                      }`}
                    >
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
                        {initiatingCall === appointment._id ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Connecting...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                            Start Video Call
                          </>
                        )}
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
