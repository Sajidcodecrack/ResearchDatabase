import React from 'react';
import PaperCard from './PaperCard';

function PapersList({ papers, onFavorite, isLoading }) {
  // Skeleton loader for loading states
  const SkeletonPaperCard = () => (
    <div className="animate-pulse bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="flex flex-wrap gap-2 my-4">
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mt-4"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800">
        Research Papers
      </h2>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonPaperCard key={index} />
          ))}
        </div>
      ) : papers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="text-gray-400 text-5xl mb-4">📭</div>
          <h3 className="text-xl text-gray-600 mb-2">No papers found</h3>
          <p className="text-gray-500">No research papers available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} onFavorite={onFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PapersList;