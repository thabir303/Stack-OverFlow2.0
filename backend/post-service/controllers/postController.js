//backend/post-service/controllers/postController.js
const Post = require("../models/Post");
const axios = require("axios");
const minioClient = require("../utils/minioConfig");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const sanitize = require("sanitize-filename");
const moment = require("moment");
const jwt = require('jsonwebtoken');

// Fetch all posts or filter by user ID
exports.getPosts = async (req, res) => {
    try {
        const { userId } = req.query; // Optional userId for filtering
        let posts;

        if (userId) {
            // Exclude posts created by the requesting user
            posts = await Post.find({ author_id: { $ne: userId } }).sort({
                createdAt: -1,
            });
        } else {
            // Fetch all posts
            posts = await Post.find().sort({ createdAt: -1 });
        }

        res.status(200).json({ success: true, posts });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Extract user ID and token from Authorization header
        const token = req.headers.authorization?.split(" ")[1]; // Bearer token
        if (!token) {
            return res.status(401).json({ message: "Authorization token is required." });
        }

        let userId;
        let senderEmail = "Unknown";
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify JWT
            userId = decodedToken.id;
            senderEmail = decodedToken.email; // Assuming `email` is part of the JWT payload
            console.log("Decoded token:", decodedToken);
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token." });
        }

        if (!title || title.trim() === "") {
            return res.status(400).json({ message: "Title is required." });
        }

        if (!content && !req.file) {
            return res.status(400).json({
                message: "Either content or file must be provided to create a post.",
            });
        }

        let fileUrl = null;
        let fileName = null;

        // Handle file upload
        if (req.file) {
            const originalName = sanitize(req.file.originalname);
            const fileExtension = path.extname(originalName);
            const uniqueFileName = `${uuidv4()}-${moment().format("HHmmss")}${fileExtension}`;

            const metaData = { "Content-Type": req.file.mimetype };

            await minioClient.putObject(
                process.env.MINIO_BUCKET_NAME,
                uniqueFileName,
                req.file.buffer,
                metaData
            );

            const protocol = process.env.MINIO_USE_SSL === "true" ? "https" : "http";
            fileUrl = `${protocol}://localhost:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${uniqueFileName}`;
            fileName = originalName;
        }

        // Create a new post object with the senderEmail included
        const newPost = new Post({
            title: title || "Untitled",
            content: content || "",
            author_id: userId,
            author_email: senderEmail, // Include sender email here
            file_url: fileUrl,
            file_name: fileName,
        });

        await newPost.save();

        // Send notification
        try {
            const notificationPayload = {
                postId: newPost._id,
                message: `A new post titled "${newPost.title}" has been created.`,
                senderEmail,
                userId,

            };
        
            console.log("Notification Payload:", notificationPayload);
        
            const response = await axios.post(
                "http://notification-service:8003/api/notifications",
                notificationPayload,
                {
                    headers: {
                        "x-api-key": process.env.NOTIFICATION_SERVICE_API_KEY,
                        Authorization: req.headers.authorization, // Forward user token
                        "Content-Type": "application/json",
                    }
                }
            );
        
            console.log("Notification sent:", response.data);
        } catch (error) {
            console.error("Error sending notification:", error.response?.data || error.message);
        }
        
        res.status(201).json({
            success: true,
            message: "Post created successfully.",
            post: newPost,
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.getPostById = async (req, res) => {
    try {
        const { postId } = req.params;

        // Find the post by its ID
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        res.status(200).json({ success: true, post });
    } catch (error) {
        console.error("Error fetching post by ID:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};


// Fetch posts by a specific user
exports.getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find posts by user ID
        const userPosts = await Post.find({ author_id: userId }).sort({
            createdAt: -1,
        });

        if (!userPosts.length) {
            return res.status(404).json({ success: false, message: "No posts found for this user." });
        }

        res.status(200).json({ success: true, posts: userPosts });
    } catch (err) {
        console.error("Error fetching user posts:", err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getUserPostCount = async (req, res) => {
    try {
        const { userId } = req.params;

        const postCount = await Post.countDocuments({ author_id: userId });

        res.status(200).json({ success: true, postCount });
    } catch (error) {
        console.error("Error fetching post count:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};
