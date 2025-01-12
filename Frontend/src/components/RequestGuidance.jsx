// RequestGuidance.js
import React, { useState } from 'react';

const RequestGuidance = () => {
  const [request, setRequest] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle request submission logic here
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Request Guidance</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Your Request</label>
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default RequestGuidance;
