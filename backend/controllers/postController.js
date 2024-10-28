//controllers/postController.js
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const User = require("../models/User");
const minioClient = require("../utils/minioConfig");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const mime = require("mime-types");
const sanitize = require("sanitize-filename");
const moment = require('moment');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

exports.uploadMiddleware = upload.single("file");

exports.getPosts = async (req, res) => {
  try {
    const { userId } = req.query;
    let posts;

    if (userId) {
      posts = await Post.find({ author_id: { $ne: userId } });
    } else {
      posts = await Post.find();
    }

    res.status(200).json({ success: true, posts: posts });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


exports.createPost = async (req, res) => {
  try {
    const { title, content, codeSnippet, fileFormat } = req.body; // Receiving file format from frontend
    const userId = req.user.id;

    if (!content && !req.file && !codeSnippet) {
      return res.status(400).json({
        message: "Content, file, or code snippet is required to create a post.",
      });
    }

    let fileUrl = null;
    let fileName = null;
    let fileType = null;

    // Get the current time in HHmmss format (e.g., 12:24:32 -> 122432)
    const currentTime = moment().format('HHmmss');

    // Handle file upload if provided
    if (req.file) {
      const originalName = sanitize(req.file.originalname);
      const fileExtension = path.extname(originalName); // Use original file extension
      const selectedFormat = fileFormat || fileExtension; // Use selected format or fallback to original

      // Generate a unique file name with the current time (hours, minutes, seconds)
      const uniqueFileName = `${uuidv4()}-${currentTime}${selectedFormat}`; 
      fileType = req.file.mimetype || mime.lookup(selectedFormat); // Detect content type

      const metaData = { "Content-Type": fileType };

      // Upload the file to MinIO
      await minioClient.putObject(
        process.env.MINIO_BUCKET_NAME,
        uniqueFileName,
        req.file.buffer,
        metaData
      );

      const protocol = process.env.MINIO_USE_SSL === "true" ? "https" : "http";
      fileUrl = `${protocol}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${uniqueFileName}`;
      fileName = originalName;
    }

    const newPost = new Post({
      title: title || "Unknown",
      content: content || "",
      author_id: userId,
      file_url: fileUrl,
      file_name: fileName,
    });

    console.log("New Post:", newPost);

    await newPost.save();

    // Fetch all users except the one who posted
    const users = await User.find({ _id: { $ne: userId } });

    if (users.length === 0) {
      console.log("No users to notify.");
      return res.status(201).json({
        success: true,
        message: "Post created successfully, but no users to notify.",
        post: newPost,
      });
    }

    const notifications = users.map((user) => ({
      recipient: user._id,
      postId: newPost._id,
      message: `A new post named: "${newPost.title}"`,
      isSeen: false,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error." });
  }
};


exports.getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all posts for the specified user
    const userPosts = await Post.find({ author_id: userId });

    if (!userPosts.length) {
      return res
        .status(404)
        .json({ success: false, message: "No posts found for this user." });
    }

    res.status(200).json({ success: true, posts: userPosts });
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ error: "Server error" });
  }
};
