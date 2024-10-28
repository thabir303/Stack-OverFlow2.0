import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PostsList from './components/PostList';
import CreatePost from './components/CreatePost';
import Notifications from './components/Notifications';

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={token ? <PostsList /> : <Navigate to="/login" />}
        />
        <Route
          path="/create"
          element={token ? <CreatePost /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={token ? <Notifications /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
