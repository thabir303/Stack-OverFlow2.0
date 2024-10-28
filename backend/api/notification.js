// routes/notification.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const notificationController = require('../controllers/notificationController');

router.get('/', authMiddleware, notificationController.getUserNotifications);
router.put('/:notificationId/markAsSeen', authMiddleware, notificationController.markNotificationAsSeen);

module.exports = router;