//backend/notification-service/controllers/notificationController.js
const Notification = require('../models/Notification');
// const User = require('../models/User');
const axios = require('axios');

// Get notifications for a specific user
exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id; // Extract the user ID from the token

        // Fetch notifications for the user
        const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });

        // Fetch post details from post-service for each notification
        const notificationsWithPosts = await Promise.all(
            notifications.map(async (notification) => {
                try {
                    const postResponse = await axios.get(
                        `http://localhost:8002/api/posts/${notification.postId}`,
                        {
                            headers: {
                                Authorization: req.headers.authorization,
                                "x-api-key": process.env.POST_SERVICE_API_KEY, 
                            },
                        }
                    );
                    return { ...notification._doc, post: postResponse.data }; // Combine notification and post details
                } catch (error) {
                    console.error(`Error fetching post ${notification.postId}:`, error.message);
                    return { ...notification._doc, post: null }; // Add `post: null` if post fetch fails
                }
            })
        );

        res.status(200).json({ success: true, notifications: notificationsWithPosts });
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// Mark a specific notification as seen
exports.markNotificationAsSeen = async (req, res) => {
    try {
        const { notificationId } = req.params; // Get the notification ID from the request parameters
        const userId = req.user.id; // Get the current user ID

        // Find and update the specific notification to mark it as "seen"
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { isSeen: true },
            { new: true } // Return the updated notification
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found.' });
        }

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

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: Missing user information." });
        }

        const senderId = req.user.id; // Extract sender ID from the token
        const senderEmail = req.user.email; // Extract sender email from the token

        console.log(`Decoded token for notifications:`, req.user);

        // Find all users except the sender
        const response = await axios.get("http://localhost:8001/api/auth", {
            headers: {
                "x-api-key": process.env.USER_SERVICE_API_KEY,
                Authorization: req.headers.authorization,
            },
        });

        const users = response.data.users.filter((user) => user._id !== senderId);
        if (!users.length) {
            return res.status(404).json({ success: false, message: "No users to notify." });
        }

        // Create notifications for each user
        const notifications = users.map((user) => ({
            recipient: user._id,
            senderEmail,
            postId,
            message: `${message}`, // Include sender email
            isSeen: false,
        }));

        const createdNotifications = await Notification.insertMany(notifications);

        res.status(201).json({
            success: true,
            message: "Notifications created successfully.",
            notifications: createdNotifications,
        });

        console.log("Notifications created:", createdNotifications);
    } catch (error) {
        console.error("Error creating notifications:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};