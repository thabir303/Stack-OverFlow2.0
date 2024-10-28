import  { useEffect, useState } from 'react';
import axios from '../api/axios';

const PostsList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/posts/getPost');
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Posts</h2>
      {posts.map((post) => (
        <div key={post._id} className="p-4 mb-4 border rounded bg-white shadow">
          <h3 className="text-xl font-bold">{post.title}</h3>
          <p>{post.content}</p>
          {post.file_url && (
            <a
              href={post.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              Download File
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostsList;
