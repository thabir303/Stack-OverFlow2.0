import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8003/api/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched notifications:', response.data.notifications);
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsSeen = async (notificationId) => {
    try {
      await axios.put(`http://localhost:8003/api/notifications/${notificationId}/markAsSeen`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Temporarily mark as seen and schedule removal
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isSeen: true } : n
        )
      );

      // Remove notification after 4-5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      }, 5000);

      // Update unread count in the navbar (optional)
      if (window.updateUnreadCount) {
        window.updateUnreadCount();
      }
    } catch (error) {
      console.error('Error marking notification as seen:', error);
    }
  };

  const viewPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-4 mb-4 border rounded ${
              notification.isSeen ? 'bg-gray-200' : 'bg-yellow-100'
            }`}
          >
            <p>{notification.message}</p>
            <div className="flex space-x-4 mt-2">
              {!notification.isSeen && (
                <button
                  onClick={() => markAsSeen(notification._id)}
                  className="text-blue-500"
                >
                  Mark as Seen
                </button>
              )}
              <button
                onClick={() => viewPost(notification.postId)}
                className="text-green-500"
              >
                View Post
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
