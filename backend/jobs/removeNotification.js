const Notification = require('../models/Notification');

const removeNotification = async () => {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() - 20);

    try {
        await Notification.deleteMany({ createdAt: { $lt: expiryDate } });
        // console.log('Old notifications deleted successfully.');
    } catch (error) {
        // console.error('Error deleting old notifications:', error);
    }
};

module.exports = removeNotification;