//frontend/src/components/PostList.jsx
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

// const baseURL = import.meta.env.VITE_BASE_URL;

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // State for currently selected post
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost/api/posts`);
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        if (error.response?.status === 401) {
          navigate('/signin'); // Redirect to login on unauthorized
        }
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  const handleViewPost = (post) => {
    setSelectedPost(post); // Set the selected post for inline preview
  };

  const handleClosePreview = () => {
    setSelectedPost(null); // Clear the selected post
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Recent Posts</h2>
        <button
          onClick={handleCreatePost}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Create Post
        </button>
      </div>

      {selectedPost ? (
        <div className="p-6 mb-6 border rounded-lg bg-gray-50 shadow-md">
          <h3 className="text-xl font-semibold mb-2">{selectedPost.title}</h3>
          {selectedPost.content && (
            <div className="my-4">
              <SyntaxHighlighter
                language="javascript" // Adjust dynamically if needed
                style={coy}
                customStyle={{
                  backgroundColor: '#f5f7fa',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  overflowX: 'auto',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                {selectedPost.content}
              </SyntaxHighlighter>
            </div>
          )}

          {selectedPost.file_url && (
            <iframe
              src={selectedPost.file_url}
              title="File Preview"
              className="w-full h-96 mt-4 border rounded-lg"
            ></iframe>
          )}

          <button
            onClick={handleClosePreview}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Close Preview
          </button>
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="p-6 mb-6 border rounded-lg bg-gray-50 shadow-md transition-transform hover:scale-[1.01]"
          >
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>

            {post.content && (
              <div className="my-4">
                <SyntaxHighlighter
                  language="javascript" // Adjust dynamically if needed
                  style={coy}
                  customStyle={{
                    backgroundColor: '#f5f7fa',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    overflowX: 'auto',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {post.content}
                </SyntaxHighlighter>
              </div>
            )}

            {post.file_url && (
              <button
                onClick={() => handleViewPost(post)}
                className="text-blue-600 underline hover:text-blue-800"
              >
                View File
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PostsList;
