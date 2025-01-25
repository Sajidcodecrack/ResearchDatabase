import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex mb-4">
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        className="border p-2 flex-grow rounded-l"
        placeholder="Search papers by keyword, author, or topic..."
      />
      <button 
        onClick={handleSearch} 
        className="bg-blue-500 text-white p-2 rounded-r">
        Search
      </button>
    </div>
  );
}

export default SearchBar;
