
const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-5">Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>ID:</strong> {user.id}</p>
    </div>
  );
};

export default Profile;
