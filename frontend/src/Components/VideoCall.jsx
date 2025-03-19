import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { Auth } from "../Contexts/AuthContext";

const VideoCall = () => {
  const { roomId } = useParams();
  const { user } = useContext(Auth);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const myVideo = useRef(null);
  const socketRef = useRef(null);
  console.log(user);
  useEffect(() => {
    if (!user) {
      setError("❌ User is not authenticated. Please log in.");
      return;
    }

    console.log("📡 Fetching Appointment Details for:", roomId);

    const fetchAppointmentDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getAppointmentByRoom/${roomId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`❌ Failed to fetch appointment: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Appointment Data:", data);
        setAppointmentDetails(data);
      } catch (err) {
        setError(err.message);
        console.error("❌ API Error:", err);
      }
    };

    fetchAppointmentDetails();
  }, [roomId, user]);

  // ✅ Fix WebSocket Connection
  useEffect(() => {
    console.log("📡 Connecting WebSocket for room:", roomId);

    socketRef.current = new WebSocket("ws://localhost:3000");

    socketRef.current.onopen = () => {
      console.log("✅ WebSocket Connected");
      socketRef.current.send(JSON.stringify({ type: "join", roomId }));
    };

    socketRef.current.onclose = (event) => {
      console.warn("❌ WebSocket Disconnected:", event.code, event.reason);
    };

    return () => {
      console.log("♻ Cleaning up WebSocket...");
      socketRef.current?.close();
    };
  }, [roomId]);

  // ✅ Fix Video Stream Not Appearing
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        console.log("🎥 Local Video Stream Obtained");
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        setError("Camera or microphone access denied.");
        console.error("❌ Failed to get media devices:", err);
      });
  }, []);

  return (
    <div>
      <h1>Video Call Room: {roomId}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <video
        ref={myVideo}
        autoPlay
        playsInline
        style={{ width: "400px", height: "300px", background: "black" }}
      />
    </div>
  );
};

export default VideoCall;
