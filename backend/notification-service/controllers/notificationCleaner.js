//backend/notification-service/controllers/notificationCleaner.js
const cron = require('node-cron');
const Notification = require('../models/Notification'); // Adjust the path as needed

const notificationCleaner = () => {
  // Schedule the job to run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Running notification cleaner job...');

      // Delete notifications that are seen and have expired
      const result = await Notification.deleteMany({
        isSeen: true,
        expiresAt: { $lt: new Date() }, // Ensure the notification has expired
      });

      console.log(`Deleted ${result.deletedCount} seen and expired notifications.`);

      // Optionally, you can add another condition to remove unseen expired notifications, 
      // but for now, we will handle that when marking as seen.
    } catch (error) {
      console.error('Error running notification cleaner job:', error);
    }
  });
};

module.exports = notificationCleaner;