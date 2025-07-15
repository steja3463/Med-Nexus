import React, { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Auth } from "../Contexts/AuthContext";
import axios from "axios";
import Loading from "./Loading";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(Auth);
  const navigate = useNavigate();

  // Use environment variable or a config file for API URL
  const API_URL = "http://localhost:3000";

  useEffect(() => {
    // Fetch patient's appointments
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/patients/appointments`,
          {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          }
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/patients/bookAppointment`,
          {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
      fetchNotifications();
    }
  }, [user, API_URL]);

  // Set up websocket connection for real-time notifications
  useEffect(() => {
    let socket;

    const connectSocket = async () => {
      try {
        // Dynamically import to avoid server-side rendering issues
        const { io } = await import("socket.io-client");
        socket = io(API_URL, {
          auth: {
            token: user,
          },
        });

        // Listen for incoming video call notifications
        socket.on("videoCallInitiated", (data) => {
          const { roomId, doctorName, appointmentId } = data;

          // Add to notifications
          setNotifications((prev) => [
            {
              id: Date.now(),
              type: "videoCall",
              message: `Dr. ${doctorName} is calling you now`,
              roomId,
              appointmentId,
              read: false,
              timestamp: new Date().toISOString(),
            },
            ...prev,
          ]);

          // Show browser notification if supported
          if ("Notification" in window) {
            if (Notification.permission === "granted") {
              new Notification(`Incoming call from Dr. ${doctorName}`, {
                body: "Click to join the video call",
                icon: "/notification-icon.png",
              });
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                  new Notification(`Incoming call from Dr. ${doctorName}`, {
                    body: "Click to join the video call",
                    icon: "/notification-icon.png",
                  });
                }
              });
            }
          }
        });

        // Listen for notification updates
        socket.on("notificationUpdate", (data) => {
          fetchNotifications();
        });

        // Listen for appointment updates
        socket.on("appointmentUpdate", (data) => {
          fetchAppointments();
        });
      } catch (error) {
        console.error("Socket connection error:", error);
      }
    };

    if (user) {
      connectSocket();
    }

    // Clean up socket connection on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user, API_URL]);

  // Join video call and mark notification as read
  const joinVideoCall = (roomId, notificationId) => {
    // Mark notification as read
    if (notificationId) {
      markNotificationAsRead(notificationId);
    }

    // Navigate to video call room
    navigate(`/video-call-room/${roomId}`);
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${API_URL}/api/patients/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Patient Dashboard
        </h1>
        <div className="mb-6 text-right">
          <a
            href="http://localhost:8081"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-lg inline-block"
          >
            Ask Dr. AI (Chatbot)
          </a>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            Notifications
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </h2>

          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    !notification.read
                      ? "border-l-4 border-l-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p
                        className={`${!notification.read ? "font-medium" : ""}`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>

                    {notification.type === "videoCall" && (
                      <button
                        onClick={() =>
                          joinVideoCall(notification.roomId, notification.id)
                        }
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Join Call
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 text-gray-600">
              No notifications available.
            </div>
          )}
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Your Appointments
          </h2>

          {appointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((appointment) => {
                const appointmentDate = new Date(appointment.date);
                const appointmentTime = new Date(
                  appointment.date + " " + appointment.time
                );
                const isToday =
                  new Date().toDateString() === appointmentDate.toDateString();
                const isPast = appointmentDate < new Date();

                return (
                  <div
                    key={appointment.id}
                    className={`border rounded-lg p-4 ${
                      isToday
                        ? "border-blue-500 bg-blue-50"
                        : isPast
                        ? "border-gray-300 bg-gray-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Dr. {appointment.doctorName}
                        </h3>
                        <p className="text-gray-600">{appointment.specialty}</p>
                        <p className="text-gray-800 mt-2">
                          {appointmentDate.toLocaleDateString()} at{" "}
                          {appointmentTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p
                          className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-semibold
                          ${
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : appointment.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </p>
                      </div>

                      {appointment.status === "confirmed" && isToday && (
                        <button
                          onClick={() => joinVideoCall(appointment.roomId)}
                          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors
                            ${
                              appointment.callAvailable
                                ? ""
                                : "opacity-50 cursor-not-allowed"
                            }`}
                          disabled={!appointment.callAvailable}
                        >
                          {appointment.callAvailable
                            ? "Join Video Call"
                            : "Awaiting Doctor"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-4 text-gray-600">
              No appointments scheduled. Book an appointment to get started.
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/book-appointment")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Book New Appointment
            </button>
          </div>
        </div>

        {/* Router Outlet for nested routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default PatientDashboard;
