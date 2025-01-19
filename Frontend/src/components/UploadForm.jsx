
import React, { useState } from 'react';
import axios from 'axios';

function UploadForm({ onUpload }) {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('abstract', abstract);
    formData.append('keywords', keywords);
    formData.append('pdf', pdfFile);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpload();
      setTitle('');
      setAbstract('');
      setKeywords('');
      setPdfFile(null);
    } catch (error) {
      console.error('Error uploading paper:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="block w-full p-2 border rounded"
      />
      <textarea
        value={abstract}
        onChange={(e) => setAbstract(e.target.value)}
        placeholder="Abstract"
        className="block w-full p-2 border rounded"
      ></textarea>
      <input
        type="text"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder="Keywords"
        className="block w-full p-2 border rounded"
      />
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Upload Paper
      </button>
    </form>
  );
}

export default UploadForm;
