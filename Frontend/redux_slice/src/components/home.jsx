import React from 'react';
import { Link } from 'react-router-dom';
import smart_invet from '../assets/smart_invet.jpeg';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-500 flex flex-col md:flex-row px-4 py-16">
      <div className="max-w-5xl mx-auto text-center md:text-left flex-1">
        <h1 className="text-5xl font-bold text-white mb-4">Smart Inventory Management System</h1>
        <p className="text-2xl text-white max-w-2xl mx-auto md:mx-0 mb-12">
          The intelligent way to track, manage, and optimize your inventory
        </p>
        <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
          <Link to="/login">
            <button className="bg-gray-800 text-white px-10 py-4 rounded-lg hover:bg-gray-900 transition duration-300 ease-in-out text-center text-lg font-medium shadow-md transform hover:-translate-y-1 w-full">
              Login
            </button>
          </Link>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center shadow-2xl rounded-lg overflow-hidden">
        <img src={smart_invet} alt="Inventory Management" className="object-cover w-full h-full rounded-lg shadow-lg" />
      </div>
    </div>
  );
};

export default HomePage;