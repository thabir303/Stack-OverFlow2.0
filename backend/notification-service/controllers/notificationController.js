//backend/notification-service/controllers/notificationController.js
const Notification = require('../models/Notification');
// const User = require('../models/User');
const axios = require('axios');

// Get notifications for a specific user
exports.getUserNotifications = async (req, res) => {
  try {
      const userId = req.user.id;
      const currentTime = new Date();

      // Fetch notifications where the userId is in the recipients array
      const notifications = await Notification.find({
          "recipients.userId": userId, // Check if userId exists in the recipients array
          expiresAt: { $gte: currentTime }, // Only fetch notifications that haven't expired
      }).sort({ createdAt: -1 });

      const notificationsWithPosts = await Promise.all(
          notifications.map(async (notification) => {
              try {
                  const postResponse = await axios.get(
                      `http://post-service:8002/api/posts/${notification.postId}`,
                      {
                          headers: {
                              Authorization: req.headers.authorization,
                              'x-api-key': process.env.POST_SERVICE_API_KEY,
                          },
                      }
                  );
                  return { ...notification._doc, post: postResponse.data };
              } catch (error) {
                  console.error(`Error fetching post ${notification.postId}:`, error.message);
                  return { ...notification._doc, post: null }; // Add `post: null` if post fetch fails
              }
          })
      );

      res.status(200).json({ success: true, notifications: notificationsWithPosts });
  } catch (error) {
      console.error('Error fetching notifications:', error.message);
      res.status(500).json({ message: 'Server error.' });
  }
};


// Mark a specific notification as seen
exports.markNotificationAsSeen = async (req, res) => {
  try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      // Find the notification by its ID
      const notification = await Notification.findOne({ _id: notificationId });

      if (!notification) {
          return res.status(404).json({ message: 'Notification not found.' });
      }

      // Check if the user is in the recipients array
      const recipientIndex = notification.recipients.findIndex(
          (recipient) => recipient.userId.toString() === userId.toString()
      );

      if (recipientIndex === -1) {
          return res.status(400).json({ message: 'User not in recipients list.' });
      }

      // Mark the notification as seen for that user
      notification.recipients[recipientIndex].isSeen = true;

      // If notification is expired and is marked as seen, delete it from the database
      const currentTime = new Date();
      if (notification.expiresAt < currentTime) {
          await Notification.deleteOne({ _id: notificationId });
          return res.status(200).json({ success: true, message: 'Expired notification deleted after being marked as seen.' });
      }

      await notification.save();

      res.status(200).json({ success: true, notification });
  } catch (error) {
      console.error('Error marking notification as seen:', error);
      res.status(500).json({ message: 'Server error.' });
  }
};

// Create notifications for multiple users
exports.createNotification = async (req, res) => {
    try {
        const { postId, message } = req.body;

        const senderId = req.body.userId; // Extract sender ID from the token
        const senderEmail = req.body.senderEmail; // Extract sender email from the token

        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 1); // Set 5 minutes expiration

        console.log(`Decoded token for notifications:`, req.user);

        // Find all users except the sender
        const response = await axios.get("http://user-service:8001/api/auth", {
            headers: {
                "x-api-key": process.env.USER_SERVICE_API_KEY,
                Authorization: req.headers.authorization,
            },
        });

        const users = response.data.users.filter((user) => user._id !== senderId);
        if (!users.length) {
            return res.status(404).json({ success: false, message: "No users to notify." });
        }

        // Create a new notification object
        const notification = new Notification({
          postId,
          message,
          senderEmail,
          recipients: users.map(user => ({
               userId: user._id,
               isSeen: false,
          })),
          expiresAt: expirationTime,
        });

        await notification.save();
        res.status(201).json({
            success: true,
            message: "Notifications created successfully.",
            notification,
        });

        console.log("Notifications created:", notification);
    } catch (error) {
        console.error("Error creating notifications:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};
