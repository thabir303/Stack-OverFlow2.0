//backend/notification-service/controllers/notificationCleaner.js
const cron = require('node-cron');
const Notification = require('../models/Notification'); // Adjust the path as needed

const notificationCleaner = () => {
  // Schedule the job to run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Running notification cleaner job...');
      // Find notifications that have been seen by all users
      const seenNotifications = await Notification.find({ isSeen: true });

      // Delete seen notifications
      const result = await Notification.deleteMany({ isSeen: true });
      console.log(`Deleted ${result.deletedCount} seen notifications.`);
    } catch (error) {
      console.error('Error running notification cleaner job:', error);
    }
  });
};

module.exports = notificationCleaner;