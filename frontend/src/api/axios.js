// frontend/src/api/axios.js
import axios from 'axios';

// Set up Axios default configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8001/api',  // Adjust the URL as necessary
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Add token to the request
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
