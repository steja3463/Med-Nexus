import React, { useContext, useState } from "react";
import admin from "../assets/admin.avif";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Auth } from "../Contexts/AuthContext";

const AddAdmin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useContext(Auth)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/addAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user}`
        },
        body: JSON.stringify({ userName, password, email })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Admin added successfully");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
    setEmail('')
    setPassword('')
    setUserName('')
    
  };

  return (
    <div className="flex justify-center items-center gap-10 mt-7">
      <ToastContainer />
      <img className="w-1/3 h-auto" src={admin} alt="Admin" />
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-semibold text-slate-700">
          Admin Registration
        </h1>
        <form
          className="shadow-2xl flex flex-col justify-center mt-4 items-center border-2 rounded-lg w-96 gap-6 py-7"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col justify-start items-center gap-4">
            <p className="mr-[185px]">Enter username</p>
            <input
              className="p-2 outline-none border-2 rounded-lg w-full"
              type="text"
              placeholder="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <p className="mr-[185px]">Enter password</p>
            <input
              className="p-2 outline-none border-2 rounded-lg w-full"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <p className="mr-[215px]">Enter email</p>
            <input
              className="p-2 outline-none border-2 rounded-lg w-[310px]"
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            className="shadow-lg hover:bg-blue-800 w-[315px] h-9 bg-blue-500 rounded-full text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
