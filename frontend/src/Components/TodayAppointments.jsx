/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import Loading from './Loading';
import { Auth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


const TodayAppointments = () => {

    const [appointments,setAppointments] = useState([]);
    const [loading,setLoading] = useState(true);
    const {user} = useContext(Auth);
    const nav = useNavigate();
    const fetchAppointments = async () => {
        setLoading(true);
        const response = await fetch('http://localhost:3000/getAppointments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user}`
            }
        }) 
        const data = await response.json();
        setAppointments(data);
        setLoading(false);
    }

    const handleAddPrescription = (id) => {
        nav(`/dashboard/doctor/addPrescription/${id}`)
    }

    const handleMarkAsCompleted =async (id) => {
      try {
        const response = await fetch(`http://localhost:3000/markAsCompleted/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user}`
          }
        });
        if (response.ok) {
          fetchAppointments();
        } else {
          console.error('Failed to mark appointment as completed');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }


    useEffect(()=>{
        fetchAppointments();
    },[user])

    if(loading){
        <Loading />
    }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Today's Appointments</h1>
      {appointments.length === 0 ? (
        <p>No appointments for today.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map(appointment => (
            <div key={appointment._id} className="p-4 border rounded shadow-lg bg-white">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Patient: {appointment.patientId.userName}</h2>
                  <p>Time: {new Date(appointment.startTime).toUTCString()}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleAddPrescription(appointment.patientId._id)}
                    className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Add Prescription
                  </button>
                  <button
                    onClick={() => handleMarkAsCompleted(appointment._id)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Mark as Completed
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TodayAppointments
