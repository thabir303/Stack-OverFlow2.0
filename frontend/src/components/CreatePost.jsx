import  { useState } from 'react';
import axios from '../api/axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [fileFormat, setFileFormat] = useState('.txt'); // Default format

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('file', file); // Ensure 'file' matches multer's field name
    formData.append('fileFormat', fileFormat);
  
    try {
      const response = await axios.post('http://localhost:8000/api/posts/createPost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important to set this header
        },
      });
      console.log('Post created successfully:', response.data);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-5">Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            className="w-full p-2 border rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">File Format</label>
          <select
            className="w-full p-2 border rounded"
            value={fileFormat}
            onChange={(e) => setFileFormat(e.target.value)}
          >
            <option value=".txt">.txt</option>
            <option value=".cpp">.cpp</option>
            <option value=".js">.js</option>
            <option value=".java">.java</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Upload File</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
