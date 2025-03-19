import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const VideoCallRoom = () => {
  const { roomId } = useParams(); // Get room ID from URL
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState("");
  const [ws, setWs] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);

  const userVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef(null);

  useEffect(() => {
    fetchAppointmentDetails();
    initializeWebSocket();
    return () => ws?.close(); // Cleanup WebSocket on unmount
  }, []);

  // Fetch appointment details
  const fetchAppointmentDetails = async () => {
    try {
      const token = localStorage.getItem("token"); // Get auth token
      const response = await fetch(
        `http://localhost:5000/api/getAppointmentByRoom/${roomId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch appointment details");

      const data = await response.json();
      setAppointment(data);
      setIsDoctor(data.isDoctor);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch appointment details");
    }
  };

  // Initialize WebSocket connection
  const initializeWebSocket = () => {
    const wsInstance = new WebSocket("ws://localhost:5000");
    setWs(wsInstance);

    wsInstance.onopen = () => {
      console.log("Connected to WebSocket");
      wsInstance.send(JSON.stringify({ type: "join", roomId }));
    };

    wsInstance.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "userJoined":
          console.log("Another user joined. Waiting for call initiation...");
          break;
        case "callUser":
          handleIncomingCall(message);
          break;
        case "callAccepted":
          handleCallAccepted(message.signal);
          break;
        case "callEnded":
          endCall();
          break;
        default:
          break;
      }
    };

    wsInstance.onerror = (error) => console.error("WebSocket error:", error);
    wsInstance.onclose = () => console.log("WebSocket connection closed");
  };

  // Start the call (Doctor initiates)
  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      userVideoRef.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection();
      stream
        .getTracks()
        .forEach((track) => peerConnection.current.addTrack(track, stream));

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      ws.send(
        JSON.stringify({
          type: "callUser",
          roomId,
          from: "doctor",
          signalData: offer,
        })
      );
    } catch (error) {
      console.error("Error starting call:", error);
      setError("Error starting video call");
    }
  };

  // Handle incoming call
  const handleIncomingCall = async (message) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      userVideoRef.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection();
      stream
        .getTracks()
        .forEach((track) => peerConnection.current.addTrack(track, stream));

      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(message.signal)
      );

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      ws.send(JSON.stringify({ type: "answerCall", roomId, signal: answer }));
      setCallAccepted(true);
    } catch (error) {
      console.error("Error handling incoming call:", error);
    }
  };

  // Handle call acceptance
  const handleCallAccepted = async (signal) => {
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(signal)
    );
    setCallAccepted(true);
  };

  // End the call
  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    ws.send(JSON.stringify({ type: "endCall", roomId }));
    window.location.href = "/dashboard"; // Redirect user after call
  };

  return (
    <div className="container">
      <h2>Video Consultation</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="video-container">
        <video ref={remoteVideoRef} autoPlay className="video-box">
          {callAccepted ? null : <p>Waiting for other participant...</p>}
        </video>
        <video ref={userVideoRef} autoPlay muted className="video-box" />
      </div>

      <div className="controls">
        {isDoctor && !callAccepted ? (
          <button onClick={startCall} className="start-call">
            Start Call
          </button>
        ) : null}

        <button onClick={endCall} className="end-call">
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoCallRoom;
