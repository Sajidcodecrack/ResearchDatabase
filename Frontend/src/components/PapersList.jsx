import React from 'react';
import PaperCard from './PaperCard';

function PapersList({ papers, onFavorite }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} onFavorite={onFavorite} />
      ))}
    </div>
  );
}

export default PapersList;
