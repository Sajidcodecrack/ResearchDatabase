import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r bg-[#FAFAFA]">
      {/* Navbar */}
      <nav className="p-6 bg-blue-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Research_Vault</h1>
          <div className="space-x-4">
            <Link to="/register" className="text-blue-600 hover:text-blue-800">
              Register
            </Link>
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between">
        {/* Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to <span className="text-blue-600">Research_Vault</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            A collaborative platform for students and teachers to upload, download, and research papers.
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <img
            src="/HomePage.avif" // Replace with your image path
            alt="Research Illustration"
            className="w-full max-w-md lg:max-w-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;