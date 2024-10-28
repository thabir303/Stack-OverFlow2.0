import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin'); // Redirect to login page after logout
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 onClick={() => navigate('/')} className="text-xl font-bold cursor-pointer">
        StackOverflow
      </h1>
      <div>
        <button onClick={() => navigate('/posts')} className="mr-4">
          Home
        </button>
        <button onClick={() => navigate('/notifications')} className="mr-4">
          Notifications
        </button>
        <button onClick={() => navigate('/profile')} className="mr-4">
          Profile
        </button>
        {isAuthenticated ? (
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
            Logout
          </button>
        ) : (
          <button onClick={() => navigate('/signin')} className="bg-blue-500 px-4 py-2 rounded">
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
