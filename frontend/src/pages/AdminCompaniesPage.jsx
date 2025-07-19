import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moderationStatus, setModerationStatus] = useState('pending');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadCompanies();
  }, [moderationStatus]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const response = await apiService.getCompanies({ 
        moderation_status: moderationStatus,
        limit: 50
      });
      setCompanies(response.results || response);
      setTotalCount(response.count || response.length || 0);
      setLoading(false);
    } catch (err) {
      setError('Failed to load companies. Please try again.');
      setLoading(false);
    }
  };

  const handleStatusChange = async (companyId, newStatus) => {
    try {
      // Find the company by ID
      const company = companies.find(c => c.id === companyId);
      if (!company) return;
      
      // Update the company with new moderation status
      await apiService.updateCompany(company.slug, {
        ...company,
        moderation_status: newStatus
      });
      
      // Refresh the list
      loadCompanies();
    } catch (err) {
      setError('Failed to update company status. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Company Administration</h1>
        <div className="flex space-x-2">
          <select
            value={moderationStatus}
            onChange={(e) => setModerationStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">Pending Review</option>
            <option value="accepted">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All Companies</option>
          </select>
          <Link
            to="/add-company"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Company
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {moderationStatus === 'all' 
              ? 'All Companies' 
              : `${moderationStatus.charAt(0).toUpperCase() + moderationStatus.slice(1)} Companies`}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Showing {companies.length} of {totalCount} companies
          </p>
        </div>
        
        {loading ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-sm text-gray-500">Loading companies...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-sm text-gray-500">No companies found with this status.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {companies.map((company) => (
              <li key={company.id}>
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex items-center">
                    {company.logo ? (
                      <img 
                        src={company.logo} 
                        alt={company.name} 
                        className="h-10 w-10 rounded-full mr-4 object-contain bg-gray-100"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full mr-4 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {company.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-medium text-blue-600 hover:text-blue-800">
                        <Link to={`/companies/${company.slug}`}>
                          {company.name}
                        </Link>
                      </h4>
                      <p className="text-sm text-gray-500">
                        {company.short_description}
                      </p>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <span className="mr-2">{company.hq_city}, {company.hq_country}</span>
                        <span className="mr-2">•</span>
                        <span>Status: {company.status}</span>
                        <span className="mr-2">•</span>
                        <span>Moderation: {company.moderation_status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {company.moderation_status !== 'accepted' && (
                      <button
                        onClick={() => handleStatusChange(company.id, 'accepted')}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                      >
                        Approve
                      </button>
                    )}
                    {company.moderation_status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(company.id, 'rejected')}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                      >
                        Reject
                      </button>
                    )}
                    {company.moderation_status !== 'pending' && (
                      <button
                        onClick={() => handleStatusChange(company.id, 'pending')}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
                      >
                        Mark Pending
                      </button>
                    )}
                    <Link
                      to={`/edit-company/${company.slug}`}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminCompaniesPage;