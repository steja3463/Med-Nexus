import { Bell } from 'lucide-react';
import React, { useEffect, useState, useContext } from 'react';
import { Auth } from '../Contexts/AuthContext'; // Adjust the import according to your project structure
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmationStatus = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(Auth); // Assuming you have a context for auth

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:3000/getStatus', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user}`, // Assuming user object has token
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const { notifications } = await response.json();
      console.log(notifications);
      if (Array.isArray(notifications)) {
        setNotifications(notifications);
      } else {
        throw new Error('Response data is not an array');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationAsSeen = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/markAsSeen/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user}`, // Assuming user object has token
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as seen');
      }

      setNotifications(notifications.filter(notification => notification._id !== id));

      // Show toast message
      toast.success('Notification marked as seen');
    } catch (error) {
      console.error('Error marking notification as seen:', error);
      toast.error('Failed to mark notification as seen');
    }
  };

  return (
    <div className="m-5">
      <h1 className="text-left font-semibold text-2xl flex gap-3 items-center">
        Status of Bookings <Bell />
      </h1>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div key={index} className="h-16 flex justify-between items-center rounded-lg gap-8 mt-5 bg-slate-200">
            <p className="ml-4">{notification.message}</p>
            <div className="flex gap-6 mr-8">
              {!notification.markAsSeen && (
                <button onClick={() => markNotificationAsSeen(notification._id)} className="flex w-32 h-[50px] bg-blue-300 hover:bg-blue-500 justify-around items-center rounded-2xl">
                  Mark as Seen
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No notifications available.</p>
      )}
      <hr className="bg-slate-400 h-[2px] mt-6" />
      <ToastContainer />
    </div>
  );
};

export default ConfirmationStatus;
