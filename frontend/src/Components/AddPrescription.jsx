
/* eslint-disable react/no-unescaped-entities */


import React, { useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Loading from "./Loading";
import { Auth } from "../Contexts/AuthContext";
import { useParams } from "react-router-dom";


const AddPrescription = () => {
  const [medications, setMedications] = useState([{ name: "", dosage: "" }]);
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [cause, setCause] = useState("");
  const [loading, setLoading] = useState(false);
  const {id} = useParams();
  
  const {user} = useContext(Auth)

  const handleInputChange = (index, event) => {
    const values = [...medications];
    values[index][event.target.name] = event.target.value;
    setMedications(values);
  };

  const handleAddFields = () => {
    setMedications([...medications, { name: "", dosage: "" }]);
  };

  const handleRemoveFields = (index) => {
    const values = [...medications];
    values.splice(index, 1);
    setMedications(values);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setLoading(true);

    const prescriptionData = {
      patientName,
      medicines: medications.map(med => med.name),
      dosages: medications.map(med => med.dosage),
      cause,
    };

   

    // console.log(prescriptionData);
    try {
      const response = await fetch(`http://localhost:3000/addPrescription/${id}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user}`
        },
        body: JSON.stringify(prescriptionData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        toast.success("Prescription added successfully!");
      } else {
        const error = await response.json();
        console.error(error);
        toast.error("Failed to add prescription!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while adding the prescription.");
    } finally {
      setLoading(false);
    }
    setPatientName("");
    setAge("");
    setMedications([{ name: "", dosage: "" }]);
    setCause("");

  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <ToastContainer />
      {loading ? <Loading /> : (
        <>
          <h2 className="text-2xl font-bold mb-4 text-center">Add Prescription</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Patient Name</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>
            

            {medications.map((medication, index) => (
              <div key={index} className="mb-4">
                <div className="flex">
                  <div className="w-1/2 pr-2">
                    <label className="block text-gray-700">Medication Name</label>
                    <input
                      type="text"
                      name="name"
                      value={medication.name}
                      onChange={(event) => handleInputChange(index, event)}
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                      required
                    />
                  </div>
                  <div className="w-1/2 pl-2">
                    <label className="block text-gray-700">Dosage</label>
                    <input
                      type="text"
                      name="dosage"
                      value={medication.dosage}
                      onChange={(event) => handleInputChange(index, event)}
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFields(index)}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddFields}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white p-2 rounded mb-4"
            >
              Add Medication
            </button>

            <div className="mb-4">
              <label className="block text-gray-700">Special Instructions</label>
              <textarea
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                rows="4"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-700"
            >
              Submit
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddPrescription;

