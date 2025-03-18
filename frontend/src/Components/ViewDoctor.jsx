

import React, { useContext, useEffect, useState } from "react";
import doc from "../assets/doc.avif";
import { Star } from "lucide-react";
import { useParams } from "react-router-dom";
import { Auth } from "../Contexts/AuthContext";
import Loading from './Loading'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewDoctor = () => {
  const [details, setDetails] = useState(null); 
  const { id } = useParams();
  const { user } = useContext(Auth);
  const [date,setDate]  = useState("")

  useEffect(() => {
    fetchDetails();
  }, []);

 

  const bookAppointment = async () => {
    try {
      const token = user
      console.log(token);
      console.log(new Date(date).toISOString());
      const book = await fetch(`http://localhost:3000/bookAppointment`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`

        },
        body:JSON.stringify({"doctorId":id,"startTime":date})
      })
      const data = await book.json()
      console.log(data)
      if(book.ok){
        toast.success("Appointment is Pending ! Check Notifications")
      }
    } catch (error) {
      console.log(error);
    }
  }

  console.log(date);
  const fetchDetails = async () => {
    try {
      const token = user?.token; 
      // console.log(token);
      // console.log("Token:", token);
      const response = await fetch(`http://localhost:3000/doctors/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      

      const data = await response.json();


      if (response.ok) {
        setDetails(data.getDoc);
      } else {
        console.error('Failed to fetch doctor details:', data);
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  if (!details) {
    return <Loading />; 
  }

  return (
    <div className="flex justify-evenly mt-5">
      <ToastContainer/>
      <div>
        <div className="flex ">
          <div className="w-36 shadow-2xl rounded-full">
            <img className="rounded-xl" src={doc} alt="Doctor" />
          </div>
          <div className="flex flex-col justify-center items-start ml-5">
            <span className="mr-14 bg-blue-400 p-2 rounded-xl text-white">
              {details.specialization}
            </span>
            <p className="text-xl font-semibold mt-4">Dr. {details.name}</p>
            <p className="flex mr-24 gap-2 mt-2">
              <Star color="gold" />
              4.5
            </p>
            <p className="mt-3">Specialization in {details.specialization}</p>
          </div>
        </div>
        <div className="mt-10">
          <h1>About</h1>
          <hr className="bg-slate-400 h-[1px] mt-4" />
          <p className="mt-6 flex">
            About <span className="text-blue-500 ml-2 font-semibold">{details.name}</span>
          </p>
          <p className="mt-6 text-sm text-slate-600">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga,
            <br />
            optio expedita impedit consequatur non soluta ad repellat ea ipsum
            <br />
            rerum modi iste corrupti veniam aut recusandae sit fugiat et. Cum.
            <br />
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
            <br />
            saepe, accusamus provident quia beatae totam atque laborum officiis
            <br />
            quaerat voluptates recusandae iure? Obcaecati voluptate incidunt
            <br />
            doloribus rerum, libero voluptatibus laborum!
          </p>
        </div>
      </div>
      <div className="w-72 h-64 bg-slate-200 shadow-xl mr-28 mt-14 rounded-xl">
        <div className="flex justify-center items-center gap-20 mt-5">
          <h1 className="text-lg font-semibold">Normal Cost</h1>
          <p>Rs{details.costPerVisit}</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="my-7">Choose the Time Slot:</p>
          {/* <div className="flex justify-around items-center mt-3">
            <p className="text-sm text-slate-600">Sunday:</p>
            <p className="text-sm text-slate-600">4:30pm-9:30pm</p>
          </div>
          <div className="flex justify-around items-center mt-3">
            <p className="text-sm text-slate-600">Tuesday:</p>
            <p className="text-sm text-slate-600">4:30pm-9:30pm</p>
          </div>
          <div className="flex justify-around items-center mt-3">
            <p className="text-sm text-slate-600">Thursday:</p>
            <p className="text-sm text-slate-600">4:30pm-9:30pm</p>
          </div> */}
          <input className="p-3 bg-slate-100 rounded-md" value={date} onChange={(e)=>setDate(e.target.value)} type="datetime-local"/>

          <div className="flex justify-center items-center">
            <button className="w-60 shadow-lg mt-4 hover:bg-blue-800 h-9 bg-blue-500 rounded-full text-white text-xs font-medium " onClick={bookAppointment}>
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDoctor;
