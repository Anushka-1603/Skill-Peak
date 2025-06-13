import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div className="text-center p-10 font-semibold text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center sm:text-left">My Profile</h1>
      
      <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</p>
          <p className="text-lg text-gray-800 mt-1">{user.username}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</p>
          <p className="text-lg text-gray-800 mt-1">{user.email}</p>
        </div>
        
        {/* {// Future
        <div className="mt-8 text-right">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
            Edit Profile
          </button>
        </div>
} */}
      </div>
    </div>
  );
};

export default Profile;