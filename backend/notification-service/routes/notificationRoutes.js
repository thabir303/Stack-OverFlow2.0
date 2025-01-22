//backend/notification-service/routes/notificationRoutes.js
const express = require("express");
const {
    getUserNotifications,
    markNotificationAsSeen,
    createNotification,
} = require("../controllers/notificationController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

// Get all notifications for a user
router.get("/", authMiddleware, getUserNotifications);

// Mark a specific notification as seen
router.put("/:notificationId/markAsSeen", authMiddleware, markNotificationAsSeen);

// Create a notification
router.post("/", authMiddleware, createNotification);

module.exports = router;
