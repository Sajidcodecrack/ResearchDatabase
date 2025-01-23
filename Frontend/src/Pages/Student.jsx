import React from 'react'
import AssignedTopics from '../components/AssignedTopic'
import SubmitResearchPaper from '../components/SubmitResearch'

import Tpaperlist from '../components/Tpaperlist'

const Student = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Research Project Managment</h1>
      </header>
      <main className="space-y-10">
        <AssignedTopics></AssignedTopics>
        <SubmitResearchPaper></SubmitResearchPaper>

        <Tpaperlist></Tpaperlist>
      </main>
    </div>
  );
};

export default Student