//backend/post-service/utils/minioConfig.js
const Minio = require("minio");
require("dotenv").config();

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const bucketName = process.env.MINIO_BUCKET_NAME;

// Check if bucket exists, create if not, and make it public
(async () => {
  try {
    const bucketExists = await minioClient.bucketExists(bucketName);
    console.log(`Checking if bucket "${bucketExists}" exists...`);
    if (bucketExists) {
      console.log(`Bucket "${bucketName}" already exists.`);
    } else {
      // Create bucket
      await minioClient.makeBucket(bucketName, "us-east-1");
      console.log(`Bucket "${bucketName}" created successfully.`);

      // Set bucket policy to public
      const bucketPolicy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucketName}/*`],
          },
        ],
      };

      await minioClient.setBucketPolicy(bucketName, JSON.stringify(bucketPolicy));
      console.log(`Bucket "${bucketName}" is now public.`);
    }
  } catch (err) {
    console.error("Error setting up MinIO bucket:", err.message);
  }
})();

module.exports = minioClient;
