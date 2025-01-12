import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignedTopics = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/topics')
      .then(response => {
        setTopics(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the topics!', error);
      });
  }, []);

  const handleDownload = (id) => {
    axios.get(`http://localhost:5000/download/${id}`, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'paper.pdf');
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        console.error('There was an error downloading the file!', error);
      });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Assigned Topics</h2>
      <ul className="space-y-4">
        {topics.map(topic => (
          <li key={topic.id} className="p-4 border rounded-lg hover:bg-gray-50">
            <h3 className="text-lg font-semibold">{topic.title}</h3>
            <p className="text-gray-600">Assigned by: {topic.assignedBy}</p>
            <button
              onClick={() => handleDownload(topic.id)}
              className="mt-2 bg-green-500 text-white p-2 rounded"
            >
              Download PDF
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignedTopics;
