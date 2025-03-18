import React from "react";
import { Outlet } from "react-router-dom";

const DoctorDashboard = () => {
  return (
    <>
      <div>
        <h1>Doctor Details</h1>
      </div>
      <Outlet />
    </>
  );
};

export default DoctorDashboard;
