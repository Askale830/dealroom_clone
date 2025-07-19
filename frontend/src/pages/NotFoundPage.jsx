import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-20">
    <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center">
      <AlertTriangle size={48} className="text-yellow-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">Go to Homepage</Link>
    </div>
  </div>
);

export default NotFoundPage;
