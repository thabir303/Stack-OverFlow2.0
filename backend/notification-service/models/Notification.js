//backend/notification-service/models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        senderEmail: {
            type: String,
            required: true, 
        },
        isSeen: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        expiresAt: {
            type: Date, // Add expiresAt field
            required: true, // This should be set during notification creation
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;