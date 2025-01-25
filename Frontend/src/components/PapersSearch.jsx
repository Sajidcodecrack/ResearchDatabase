import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';

const PapersSearch = () => {
  const [papers, setPapers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/papers')
      .then(response => {
        setPapers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the papers!', error);
      });
  }, []);

  const handleSearch = (query) => {
    axios.get(`http://localhost:5000/search?query=${query}`)
      .then(response => {
        setSearchResults(response.data);
      })
      .catch(error => {
        console.error('There was an error searching for papers!', error);
      });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <SearchBar onSearch={handleSearch} />
      <h2 className="text-xl font-bold mb-4">Search Results</h2>
      <ul>
        {searchResults.map(paper => (
          <li key={paper.id} className="mb-4">
            <h3 className="text-lg font-semibold">{paper.title}</h3>
            <p>{paper.abstract}</p>
            <p className="text-sm text-gray-600">Keywords: {paper.keywords}</p>
            <p className="text-sm text-gray-600">Uploaded by: {paper.uploaded_by}</p>
            <a href={`http://localhost:5000/${paper.pdf_path}`} target="_blank" className="text-blue-500">Download PDF</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PapersSearch;
