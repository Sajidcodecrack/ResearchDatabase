// CollaborationRequests.js
import React from 'react';

const CollaborationRequests = () => {
  const students = [
    { id: 1, name: "Alice", topic: "AI in Healthcare" },
    { id: 2, name: "Bob", topic: "Quantum Computing" },
    // Add more students as needed
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Collaboration Requests</h2>
      <ul className="space-y-4">
        {students.map(student => (
          <li key={student.id} className="p-4 border rounded-lg hover:bg-gray-50">
            <h3 className="text-lg font-semibold">{student.name}</h3>
            <p className="text-gray-600">Topic: {student.topic}</p>
            <button className="mt-2 bg-purple-500 text-white p-2 rounded">Request Collaboration</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollaborationRequests;
