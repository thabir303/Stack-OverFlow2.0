import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Home, User } from "lucide-react";
import axios from "../api/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.get(`http://localhost/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Consider only the notifications that are unread and not expired for the current user
      const unread = response.data.notifications.filter(
        (n) => !n.recipients.some((recipient) => recipient.userId === response.data.userId && recipient.isSeen) && new Date(n.expiresAt) > new Date()
      );
      setUnreadCount(unread.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin");
      }
    }
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  useEffect(() => {
    fetchNotifications();
    window.updateUnreadCount = fetchNotifications;
    return () => {
      delete window.updateUnreadCount;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <h1
              onClick={() => navigate("/posts")}
              className="text-2xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors duration-200"
            >
              StackOverflow
            </h1>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-8">
            {/* Home Button */}
            <button
              onClick={() => navigate("/posts")}
              className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={handleNotificationClick}
              className="relative text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-all duration-200"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                  {unreadCount}
                </div>
              )}
            </button>

            {/* Profile Button */}
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
