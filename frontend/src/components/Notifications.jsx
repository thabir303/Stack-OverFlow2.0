import  { useEffect, useState } from 'react';
import axios from '../api/axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/notifications');
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsSeen = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/notifications/${id}/markAsSeen`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isSeen: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as seen:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Notifications</h2>
      {notifications.map((notification) => (
        <div
          key={notification._id}
          className={`p-4 mb-4 border rounded ${
            notification.isSeen ? 'bg-gray-200' : 'bg-yellow-100'
          }`}
        >
          <p>{notification.message}</p>
          {!notification.isSeen && (
            <button
              onClick={() => markAsSeen(notification._id)}
              className="text-blue-500"
            >
              Mark as Seen
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
