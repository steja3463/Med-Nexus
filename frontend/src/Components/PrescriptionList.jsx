import React, { useState, useEffect, useContext } from 'react';
import { Auth } from '../Contexts/AuthContext';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';


  
  const PrescriptionList = () => {
      const { user } = useContext(Auth);
      const [prescriptions, setPrescriptions] = useState([]);
      const [loading, setLoading] = useState(true);
      const nav = useNavigate();
   
      useEffect(() => {
          fetchPrescriptions();
      }, []);
  
      const fetchPrescriptions = async () => {
          try {
              setLoading(true);
              const response = await fetch('http://localhost:3000/getPrescription', {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${user}`
                  },
              });
  
              if (!response.ok) {
                  throw new Error('Failed to fetch prescriptions');
              }
  
              const data = await response.json();
              setPrescriptions(data);
              setLoading(false);
          } catch (error) {
              console.error(error);
              setLoading(false);
          }
      };
  
      const handleViewDetails = (id) => {
          nav(`/dashboard/patient/viewPrescription/${id}`)
      };
  
      
  
      if (loading) return <Loading />;
  
      return (
          <div className="m-5">
              <h1 className="text-left font-semibold text-2xl flex gap-3 items-center">
                  Your Prescriptions
              </h1>
              <div className="container mx-auto mt-4">
                  {prescriptions.map((prescription, index) => (
                      <div key={index} className="flex flex-col items-start rounded-lg gap-8 bg-slate-200 p-3 mb-2">
                          <p><strong>Prescription Name:</strong> {prescription.prescriptionName}</p>
                          <p><strong>Issued On:</strong> {prescription.issuedOn}</p>
                          <button
                              className="px-2 py-1 bg-blue-500 text-white rounded"
                              onClick={() => handleViewDetails(prescription._id)}
                          >
                              View Details
                          </button>
                      </div>
                  ))}
              </div>
          </div>
      );
  };
  
  export default PrescriptionList;




