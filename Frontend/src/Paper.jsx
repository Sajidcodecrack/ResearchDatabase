import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import PapersList from './components/PapersList';
import UploadForm from './components/UploadForm';
import axios from 'axios';

function Papers() {
  const [papers, setPapers] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/papers'); // Make sure your backend has a route to get all papers
      setPapers(response.data);
    } catch (error) {
      console.error('Error fetching papers:', error);
    }
  };

  const handleSearch = (query) => {
    const filteredPapers = papers.filter((paper) =>
      paper.title.toLowerCase().includes(query.toLowerCase()) ||
      paper.author.toLowerCase().includes(query.toLowerCase()) ||
      paper.publicationYear.includes(query)
    );
    setPapers(filteredPapers);
  };

  const handleFavorite = (id) => {
    // Implement favoriting logic here (e.g., update state and make a request to the server)
  };

  const handleUpload = async (newPaper) => {
    try {
      await axios.post('http://localhost:5000/upload', newPaper); // Assuming newPaper includes form data for the file upload
      fetchPapers(); // Refresh the papers list after a successful upload
    } catch (error) {
      console.error('Error uploading paper:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <SearchBar onSearch={handleSearch} />
      <PapersList papers={papers} onFavorite={handleFavorite} />
      <UploadForm onUpload={handleUpload} /> {/* Added UploadForm component */}
    </div>
  );
}

export default Papers;
