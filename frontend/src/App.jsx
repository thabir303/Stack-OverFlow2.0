import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import PostsList from './components/PostList';
import PostDetails from './components/PostDetails';

const AppContent = () => {
  const location = useLocation();

  const hideNavbarRoutes = ['/','/signin', '/signup'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);


  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNavbar && <Navbar />} {/* Render Navbar unless on root page */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LoginPage />} /> 
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/posts" element={<PostsList />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/posts/:postId" element={<PostDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/posts" />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
