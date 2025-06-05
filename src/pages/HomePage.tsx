
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Welcome to QueueFlow
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Streamline your queue management with our comprehensive system
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Link 
              to="/admin" 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Dashboard</h3>
              <p className="text-gray-600">Manage users, settings, and analytics</p>
            </Link>
            
            <Link 
              to="/staff" 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Staff Portal</h3>
              <p className="text-gray-600">Handle queue operations and customer service</p>
            </Link>
            
            <Link 
              to="/customer" 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Area</h3>
              <p className="text-gray-600">Join queue and track your position</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
