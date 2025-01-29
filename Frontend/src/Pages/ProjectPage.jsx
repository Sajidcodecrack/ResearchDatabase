import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProjectPage() {
  const { userId } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user details from the backend
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };

  // Handle collaboration request submission
  const handleSubmitCollaboration = async () => {
    try {
      const response = await fetch('http://localhost:5000/send-collaboration-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: 1, receiverId: userId }), // Replace 1 with the logged-in user's ID
      });
      if (!response.ok) {
        throw new Error('Failed to send collaboration request');
      }
      const data = await response.json();
      alert(data.message);
      navigate('/'); // Navigate back to the RegistrationPage
    } catch (error) {
      console.error('Error sending collaboration request:', error.message);
    }
  };

  // Fetch user details on component mount
  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  if (!user) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Collaboration Request</h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm sm:shadow-md rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">User Details</h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-200">
                <div className="flex-1 mb-2 sm:mb-0">
                  <p className="text-lg font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleSubmitCollaboration}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto text-center"
              >
                Send Collaboration Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;