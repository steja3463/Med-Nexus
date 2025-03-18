
import React from 'react'
import { Outlet } from 'react-router-dom'


const AdminDashboard = () => {
  return (
    <>
    <div className='text-2xl text-blue-600 text-center'>
      No Currently avaliable Notifications.
    </div>
    <Outlet />
    </>
  )
}

export default AdminDashboard
