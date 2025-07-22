import React, { useEffect, useState } from 'react'
import Card from './Card';
import Select from 'react-select';

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [symptoms, setSymptoms] = useState([]);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);

    useEffect(() => {
        fetchSymptoms();
        fetchDoctors();
    }, []);

    const fetchSymptoms = async () => {
        try {
            const res = await fetch('http://localhost:3000/symptoms');
            const data = await res.json();
            setSymptoms(data);
        } catch (error) {
            console.error('Error fetching symptoms:', error);
        }
    };

    const fetchDoctors = async (symptomsToFilter = []) => {
        if (symptomsToFilter.length === 0) {
            // Fetch all doctors if no symptoms selected
            const docs = await fetch(`http://localhost:3000/getDoctors`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await docs.json();
            if (docs.ok) {
                setDoctors(data.getDocs);
            }
        } else {
            // Fetch filtered doctors
            const res = await fetch('http://localhost:3000/api/patients/makeAppointment/filterDoctorsBySymptoms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ symptoms: symptomsToFilter })
            });
            const data = await res.json();
            if (res.ok) {
                setDoctors(data);
            } else {
                setDoctors([]);
            }
        }
    };

    const handleSymptomChange = (e) => {
        const options = Array.from(e.target.options);
        const selected = options.filter(option => option.selected).map(option => option.value);
        setSelectedSymptoms(selected);
        fetchDoctors(selected);
    };

    return (
        <>
            <div className="mb-6 max-w-xl mx-auto">
                <label className="block mb-2 font-semibold text-gray-700">Select your symptoms (multi-select):</label>
                <Select
                    isMulti
                    options={symptoms.map(symptom => ({ value: symptom, label: symptom }))}
                    value={selectedSymptoms.map(symptom => ({ value: symptom, label: symptom }))}
                    onChange={selected => {
                        const values = selected ? selected.map(opt => opt.value) : [];
                        setSelectedSymptoms(values);
                        fetchDoctors(values);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <div className='flex flex-wrap justify-around'>
                {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                        <Card key={doctor._id} doctor={doctor} />
                    ))
                ) : (<p>No Doctors Available</p>)}
            </div>
        </>
    );
}

export default BookAppointment
