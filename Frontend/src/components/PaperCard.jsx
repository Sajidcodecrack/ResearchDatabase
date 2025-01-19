
import React from 'react';

function PaperCard({ paper, onFavorite }) {
  const handleFavorite = () => {
    onFavorite(paper.id);
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-bold">{paper.title}</h2>
      <p>{paper.abstract}</p>
      <button onClick={handleFavorite} className="bg-yellow-500 text-white p-2 rounded mt-2">
        Favorite
      </button>
    </div>
  );
}

export default PaperCard;
