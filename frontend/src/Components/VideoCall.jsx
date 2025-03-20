import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "simple-peer";
import { Auth } from "../Contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(Auth);

  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
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
          throw new Error("Failed to fetch appointment details");
        }

        const data = await response.json();
        setAppointmentDetails(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAppointmentDetails();

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

    socketRef.current = new WebSocket(`ws://localhost:8000`);

    socketRef.current.onopen = () => {
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
          break;
        case "callUser":
          setReceivingCall(true);
          setCallerSignal(data.signal);
          break;
        case "callAccepted":
          setCallAccepted(true);
          connectionRef.current.signal(data.signal);
          break;
        case "callEnded":
          handleCallEnd();
          break;
        case "doctorNotification":
          toast.info(data.message || "Doctor has initiated the video call");
          break;
        default:
          break;
      }
    };

    return () => {
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
          from: user,
          signalData: data,
        })
      );
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
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
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
    setCallAccepted(true);
  };

  const handleCallEnd = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    socketRef.current.send(
      JSON.stringify({
        type: "callEnded",
        roomId,
      })
    );
    setTimeout(() => {
      navigate(-1);
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

  const notifyPatient = () => {
    socketRef.current.send(
      JSON.stringify({
        type: "notifyPatient",
        roomId,
      })
    );
    callUser();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <ToastContainer />
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
        <div className="flex-1 flex flex-col gap-4">
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
                      : "Waiting for the other participant..."}
                  </p>
                )}
              </div>
            )}
          </div>

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

      <div className="bg-white p-4 shadow-md flex justify-center space-x-4">
        <button
          onClick={endCall}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full"
        >
          End Call
        </button>
        {appointmentDetails && appointmentDetails.isDoctor && !callAccepted && (
          <button
            onClick={notifyPatient}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Video Call
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
