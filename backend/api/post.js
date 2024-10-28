//api/post.js
const express = require('express');
const { getPosts, createPost, getUserPosts } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get('/getPost',  getPosts);

router.post('/createPost', authMiddleware, uploadMiddleware, createPost);

router.get('/userPost/:userId', authMiddleware, getUserPosts);

module.exports = router;