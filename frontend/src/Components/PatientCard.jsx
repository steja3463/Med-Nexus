import React from 'react'
import maskman from '../assets/maskman.jpg'
const PatientCard = () => {
  return (
    <div className="flex justify-around items-center mt-3">
      <div className="w-96 h-auto bg-slate-200 flex justify-around items-center leading-8 rounded-2xl shadow-lg">
        <div className="w-36 h-40">
          <img className="p-3 rounded-full mr-12 mt-2" src={maskman} />
        </div>
        <div>
          <div className="mt-2">
            <div className="flex text-sm">
              <p className="font-bold">Name</p>
              <p> : Patient known</p>
            </div>
            <div className="flex text-sm">
              <p className="font-bold">Age</p>
              <p> : 20</p>
            </div>
            <div className="flex text-sm">
              <p className="font-bold">Gender</p>
              <p> : Male</p>
            </div>
          </div>
          <button className="shadow-lg mt-4 hover:bg-blue-800 w-44 h-9 bg-blue-500 rounded-full text-white text-xs font-medium">
            Add prescription
          </button>
        </div>
      </div>
      <div className="w-96 h-auto bg-slate-200 flex justify-around items-center leading-8 rounded-2xl shadow-lg">
        <div className="w-36 h-40">
          <img className="p-3 rounded-full mr-12 mt-2" src={maskman} />
        </div>
        <div>
          <div className="mt-2">
            <div className="flex text-sm">
              <p className="font-bold">Name</p>
              <p> : Patient known</p>
            </div>
            <div className="flex text-sm">
              <p className="font-bold">Age</p>
              <p> : 21</p>
            </div>
            <div className="flex text-sm">
              <p className="font-bold">Gender</p>
              <p> : Male</p>
            </div>
          </div>
          <button className="shadow-lg mt-4 hover:bg-blue-800 w-44 h-9 bg-blue-500 rounded-full text-white text-xs font-medium">
            Add prescription
          </button>
        </div>
      </div>
      <div className="w-96 h-auto bg-slate-200 flex justify-around items-center leading-8 rounded-2xl shadow-lg">
        <div className="w-36 h-40">
          <img className="p-3 rounded-full mr-12 mt-2" src={maskman} />
        </div>
        <div>
          <div className="mt-2">
            <div className="flex text-sm">
              <p className="font-bold">Name</p>
              <p> : Patient Strange</p>
            </div>
            <div className="flex text-sm">
              <p className="font-bold">Age</p>
              <p> : 22</p>
            </div>
            <div className="flex text-sm">
              <p className="font-bold">Gender</p>
              <p> : Female</p>
            </div>
          </div>
          <button className="shadow-lg mt-4 hover:bg-blue-800 w-44 h-9 bg-blue-500 rounded-full text-white text-xs font-medium">
            Add prescription
          </button>
        </div>
      </div>
    </div>

  )
}

export default PatientCard
