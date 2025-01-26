import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Tpaperlist = () => {
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/papers')
      .then(response => {
        setPapers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the papers!', error);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Research Papers Repository</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {papers.map(paper => (
          <div key={paper.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{paper.title}</h3>
              
              <div className="flex-grow">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {paper.abstract}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  PDF Document
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {paper.uploaded_by}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {paper.keywords.split(',').map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <a 
                href={`http://localhost:5000/${paper.pdf_path}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Paper
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tpaperlist;