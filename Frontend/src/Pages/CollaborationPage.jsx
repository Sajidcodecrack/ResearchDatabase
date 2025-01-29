import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegistrationPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch registered users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/registration_db');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle collaboration request
  const handleCollaborate = (userId) => {
    navigate(`/ProjectPage/${userId}`); // Corrected navigation path
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Registered Users</h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm sm:shadow-md rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">User List</h2>
            <div className="space-y-4">
              {users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-200 hover:bg-gray-100 transition duration-200"
                  >
                    <div className="flex-1 mb-2 sm:mb-0">
                      <p className="text-lg font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                    <button
                      onClick={() => handleCollaborate(user.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto text-center"
                    >
                      Collaborate Request
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No users found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;