import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "simple-peer";
import { Auth } from "../Contexts/AuthContext";

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(Auth);

  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [error, setError] = useState(null);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    // Fetch appointment details
    const fetchAppointmentDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getAppointmentByRoom/${roomId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch appointment details");
        }

        const data = await response.json();
        setAppointmentDetails(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAppointmentDetails();

    // Get media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        setError(
          "Camera or microphone access denied. Please allow access to use video calling."
        );
        console.error("Failed to get media devices:", err);
      });

    // Connect to signaling server using WebSocket
    socketRef.current = new WebSocket(`ws://localhost:8000`);

    socketRef.current.onopen = () => {
      // Join the room
      socketRef.current.send(
        JSON.stringify({
          type: "join",
          roomId,
        })
      );
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "userJoined":
          // Someone else joined the room, initiate call if you're the doctor
          if (appointmentDetails && appointmentDetails.isDoctor) {
            callUser();
          }
          break;

        case "callUser":
          setReceivingCall(true);
          setCaller(data.from);
          setCallerSignal(data.signal);
          break;

        case "callAccepted":
          setCallAccepted(true);
          connectionRef.current.signal(data.signal);
          break;

        case "callEnded":
          handleCallEnd();
          break;

        default:
          break;
      }
    };

    return () => {
      // Cleanup
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    };
  }, [roomId, user]);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socketRef.current.send(
        JSON.stringify({
          type: "callUser",
          roomId,
          signalData: data,
        })
      );
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "callAccepted") {
        setCallAccepted(true);
        peer.signal(data.signal);
      }
    };

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socketRef.current.send(
        JSON.stringify({
          type: "answerCall",
          roomId,
          signal: data,
        })
      );
    });

    peer.on("stream", (remoteStream) => {
      userVideo.current.srcObject = remoteStream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const handleCallEnd = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    // Redirect after 3 seconds
    setTimeout(() => {
      navigate(-1); // Go back to previous page
    }, 3000);
  };

  const endCall = () => {
    socketRef.current.send(
      JSON.stringify({
        type: "endCall",
        roomId,
      })
    );
    handleCallEnd();
  };

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        // Force re-render
        setStream((prev) => ({ ...prev }));
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        // Force re-render
        setStream((prev) => ({ ...prev }));
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Video Consultation</h1>
        {appointmentDetails && (
          <p className="text-gray-600">
            {appointmentDetails.isDoctor
              ? `Patient: ${appointmentDetails.patientName}`
              : `Doctor: ${appointmentDetails.doctorName}`}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
          <p>{error}</p>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        {/* Main video container */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Their video (large) */}
          <div className="bg-black rounded-lg flex-1 flex items-center justify-center relative">
            {callAccepted && !callEnded ? (
              <video
                ref={userVideo}
                playsInline
                autoPlay
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-white text-center">
                {receivingCall && !callAccepted ? (
                  <div>
                    <p className="mb-4">Incoming call...</p>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                      onClick={answerCall}
                    >
                      Answer Call
                    </button>
                  </div>
                ) : (
                  <p>
                    {callEnded
                      ? "Call ended"
                      : "Waiting for other participant..."}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Your video (small) */}
          <div className="bg-gray-800 rounded-lg h-32 md:h-40 lg:h-48 overflow-hidden">
            {stream && (
              <video
                ref={myVideo}
                muted
                playsInline
                autoPlay
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 shadow-md flex justify-center">
        <div className="flex space-x-4">
          <button
            onClick={toggleMute}
            className="bg-gray-200 hover:bg-gray-300 p-3 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {stream && stream.getAudioTracks()[0]?.enabled ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              )}
            </svg>
          </button>
          <button
            onClick={toggleVideo}
            className="bg-gray-200 hover:bg-gray-300 p-3 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {stream && stream.getVideoTracks()[0]?.enabled ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              )}
            </svg>
          </button>
          <button
            onClick={endCall}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
