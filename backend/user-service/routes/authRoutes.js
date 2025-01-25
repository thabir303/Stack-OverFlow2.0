//backend/user-service/routes/authRoutes.js
const express = require('express');
const { signup, signin, getAllUsers } = require('../controllers/authController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

// User signup route
router.post('/signup', signup);

// User signin route
router.post('/signin', signin);

router.get('/', authMiddleware ,getAllUsers);

module.exports = router;
