import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import HomePage from './pages/HomePage';
import PostsList from './components/PostList';


function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/posts" element={<PostsList />} />
        {isAuthenticated && <Route path="/create-post" element={<CreatePost />} />}
      </Routes>
    </Router>
  );
}

export default App;