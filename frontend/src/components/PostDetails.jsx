import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilePreview, setShowFilePreview] = useState(false); // New state to handle "See More" feature

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost/api/posts/${postId}`);
        setPost(response.data.post);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded-lg w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-300 rounded-lg w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded-lg w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

        <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap border-t border-gray-200 pt-6">
          {post.content}
        </div>

        {post.file_url && (
          <div className="mt-8 bg-gray-100 p-6 rounded-lg border border-gray-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Attached File</h3>
            {showFilePreview ? (
              // Display file preview
              <div className="mt-4">
                <iframe
                  src={post.file_url}
                  title="File Preview"
                  className="w-full h-96 rounded-lg border border-gray-300"
                ></iframe>
                <button
                  onClick={() => setShowFilePreview(false)} // Hide the preview
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  Close Preview
                </button>
              </div>
            ) : (
              // Show "See More" button
              <div className="flex items-center justify-between">
                <span className="text-gray-600 truncate">{post.file_name || "Preview File"}</span>
                <button
                  onClick={() => setShowFilePreview(true)} // Show the preview
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                >
                  See More
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            Back
          </button>
        </div>
      </article>
    </div>
  );
};

export default PostDetails;
