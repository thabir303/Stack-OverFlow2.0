import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Plus, X, FileText, Clock, ChevronRight, Loader, Mail } from 'lucide-react';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost/api/posts');
        const data = await response.json();
        setPosts(data.posts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        if (error.response?.status === 401) {
          navigate('/signin');
        }
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  const handleCreatePost = () => navigate('/create-post');
  const handleViewPost = (post) => setSelectedPost(post);
  const handleClosePreview = () => setSelectedPost(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recent Posts</h1>
          <p className="text-gray-600 mt-2">Browse and share code snippets with others</p>
        </div>
        <button
          onClick={handleCreatePost}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Create Post</span>
        </button>
      </div>

      {selectedPost ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{selectedPost.title}</h2>
                <div className="flex items-center gap-3 mt-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatDateTime(selectedPost.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{selectedPost.author_email}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClosePreview}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {selectedPost.content && (
              <div className="relative">
                <SyntaxHighlighter
                  language="javascript"
                  style={coy}
                  customStyle={{
                    backgroundColor: '#f8fafc',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                  }}
                >
                  {selectedPost.content}
                </SyntaxHighlighter>
              </div>
            )}

            {selectedPost.file_url && (
              <div className="mt-6">
                <iframe
                  src={selectedPost.file_url}
                  title="File Preview"
                  className="w-full h-96 rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{formatDateTime(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{post.author_email}</span>
                      </div>
                    </div>
                  </div>
                  {post.file_url && (
                    <button
                      onClick={() => handleViewPost(post)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    >
                      <FileText className="w-5 h-5" />
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {post.content && (
                  <div className="mt-4">
                    <SyntaxHighlighter
                      language="javascript"
                      style={coy}
                      customStyle={{
                        backgroundColor: '#f8fafc',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                      }}
                    >
                      {post.content}
                    </SyntaxHighlighter>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsList;
