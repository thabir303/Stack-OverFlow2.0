//backend/post-service/utils/uploadMiddleware.js
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, 
});

const uploadMiddleware = upload.single("file"); 
module.exports = uploadMiddleware;
