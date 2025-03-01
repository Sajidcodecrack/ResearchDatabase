import React, { useState, useEffect } from 'react';
import PapersList from './components/PapersList';
import UploadForm from './components/UploadForm';
import PapersSearch from './components/PapersSearch';
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

  

  const handleFavorite = async (id) => {
    try {
      const updatedPapers = papers.map((paper) =>
        paper.id === id ? { ...paper, isFavorite: !paper.isFavorite } : paper
      );
      setPapers(updatedPapers);

      const favoritePaper = updatedPapers.find((paper) => paper.id === id);
      await axios.post('http://localhost:5000/favorite', { paperId: id, userId: 1 }); // Update favorite status on the server, assuming userId = 1 for example
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
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
      {/* <SearchBar onSearch={handleSearch} /> */}
      <PapersSearch></PapersSearch>
      <PapersList papers={papers} onFavorite={handleFavorite} />
      {/* <UploadForm onUpload={handleUpload} /> */}
       {/* Added UploadForm component */}
    </div>
  );
}

export default Papers;