// controllers/notification.controller.js
const Notification = require('../models/Notification');

exports.getUserNotifications = async (req, res) => {
    try {
      const userId = req.user.id;
      console.log('Fetching notifications for user:', userId);
  
      const notifications = await Notification.find({ recipient: userId })
        .populate('postId')
        .sort({ createdAt: -1 }); // Sort notifications by most recent
  
      console.log('Notifications fetched:', notifications);
  
      res.status(200).json({ success: true, notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Server error.' });
    }
  };
  
exports.markNotificationAsSeen = async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;
  
      // Find and update only the notification for the current user
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isSeen: true },
        { new: true }
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
  