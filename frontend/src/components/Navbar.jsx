import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <Link to="/" className="text-white text-2xl font-bold">
        StackOverflow
      </Link>
      <div className="flex items-center space-x-4">
        <Link to="/create" className="text-white">Post</Link>
        <Link to="/notifications">
          <FaBell className="text-white" size={24} />
        </Link>
        <Link to="/profile">
          <FaUserCircle className="text-white" size={24} />
        </Link>
        <button
          onClick={handleLogout}
          className="text-white border border-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
