import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { CheckCircle, BellOff } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost/api/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const currentTime = new Date();
        const updatedNotifications = response.data.notifications.filter((notification) => {
          // Show expired and unseen notifications, only hide when marked as seen
          return notification.expiresAt >= currentTime || !notification.isSeen;
        });

        setNotifications(updatedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsSeen = async (notificationId, expiresAt) => {
    try {
      // Mark notification as seen on the backend
      await axios.put(
        `http://localhost/api/notifications/${notificationId}/markAsSeen`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the UI immediately for seen notifications
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isSeen: true }
            : notification
        )
      );

      // If notification is expired and marked as seen, remove it from the UI immediately
      if (new Date(expiresAt) < new Date()) {
        const updatedNotifications = notifications.filter(
          (notification) => notification._id !== notificationId
        );
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error("Error marking notification as seen:", error);
    }
  };

  const viewPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Notifications
      </h2>
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center text-gray-500 mt-20">
          <BellOff className="w-16 h-16 mb-4" />
          <p className="text-lg">No new notifications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-6 rounded-lg shadow-sm transition-all border ${
                notification.isSeen
                  ? "bg-gray-200 border-gray-300"
                  : "bg-yellow-50 border-yellow-300"
              } hover:shadow-md hover:scale-105`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted by: {notification.senderEmail || "Unknown"}
                  </p>
                </div>
                {!notification.isSeen && (
                  <CheckCircle
                    className="w-6 h-6 text-gray-400 hover:text-green-500 cursor-pointer"
                    onClick={() => markAsSeen(notification._id, notification.expiresAt)}
                  />
                )}
              </div>
              <div className="flex justify-end mt-4 space-x-4">
                <button
                  onClick={() => markAsSeen(notification._id, notification.expiresAt)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    notification.isSeen
                      ? "bg-gray-400 text-gray-700"
                      : "bg-blue-500 text-white"
                  } hover:bg-blue-600`}
                  disabled={notification.isSeen}
                >
                  Mark as Seen
                </button>
                <button
                  onClick={() => viewPost(notification.postId)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                >
                  View Post
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
