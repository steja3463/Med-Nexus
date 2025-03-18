import React, { useContext, useState } from "react";
import addDoc from "../assets/doctor.jpg";
import {Auth} from '../Contexts/AuthContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddDoctor = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [csp, setCsp] = useState(0);
    const [loading, setLoading] = useState(false);

    const { user } = useContext(Auth)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
          const response = await fetch('http://localhost:3000/addDoc', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user}`
            },
            body: JSON.stringify({ userName, password, email, specialization, csp })
          });

          setLoading(false);
          const data = await response.json();
          if (response.ok) {
            toast.success("Doctor added successfully");
          } else {
            toast.error(data.error || "Something went wrong");
          }

          
        } catch (error) {
          console.log(error);
          toast.error("An error occurred");
          setLoading(false)
        }
        setUserName('');
        setPassword('');
        setEmail('')
        setSpecialization('')
        setCsp(0)
    }

     <ToastContainer /> 
    return (
      <div className="flex justify-center items-center h-screen gap-40">
        <div className="w-96 shadow-2xl">
          <img className="rounded-xl" src={addDoc} alt="Add Doctor" />
        </div>
        <div className="shadow-2xl px-3 w-96 h-[575px] my-auto">
          <h1 className="text-center font-semibold text-2xl text-black border-b-2 p-2">Doctor Registration</h1>
          <div>
            <div className="mt-5">
              <p className="ml-1">Enter Username</p>
              <input
                className="p-2 outline-none border-2 rounded-lg w-full mx-auto"
                type="text"
                placeholder="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="mt-5">
              <p className="ml-1">Enter Password</p>
              <input
                className="p-2 outline-none border-2 rounded-lg w-full"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-5">
              <p className="ml-1">Enter Email</p>
              <input
                className="p-2 outline-none border-2 rounded-lg w-full"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-5">
              <p className="ml-1">Specialization</p>
              <input
                className="p-2 outline-none border-2 rounded-lg w-full"
                type="text"
                placeholder="Specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>
            <div className="mt-5">
              <p className="ml-1">Enter Cost Per Visit</p>
              <input
                className="p-2 outline-none border-2 rounded-lg w-full"
                type="number"
                placeholder="CostPerVisit"
                value={csp}
                onChange={(e) => setCsp(e.target.value)}
              />
            </div>
            <button
              className="mt-5 ml-5 shadow-lg hover:bg-blue-800 w-[315px] h-9 bg-blue-500 rounded-full text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    );
};

export default AddDoctor;
