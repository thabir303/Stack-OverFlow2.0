//backend/post-service/routes/postRoutes.js
const express = require("express");
const { getPosts, createPost, getUserPosts } = require("../controllers/postController");
const uploadMiddleware = require("../utils/uploadMiddleware");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

// Get all posts
router.get("/", getPosts);

// Create a new post
router.post("/", authMiddleware, uploadMiddleware, createPost);

// Get posts by a specific user
router.get("/user/:userId", authMiddleware, getUserPosts);

module.exports = router;
