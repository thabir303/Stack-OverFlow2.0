import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

const PostDetails = () => {
  const { postId } = useParams(); // Get the postId from the route params
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8002/api/posts/${postId}`);
        console.log('Fetched post:', response.data);
        setPost(response.data.post);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.response?.data?.message || 'Error fetching post.');
      }
    };

    fetchPost();
  }, [postId]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <p>Loading post...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">{post.title}</h1>
      <p className="text-gray-700 mb-5">{post.content}</p>
      {post.file_url && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Uploaded File:</h3>
          <a
            href={post.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Download File
          </a>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
