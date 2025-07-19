import React, { useState, useEffect } from 'react';
import { personAPI } from '../services/api';
import { Search, Users, Linkedin, Twitter, Mail } from 'lucide-react';

const PeoplePage = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
  });
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPeople();
  }, [filters, currentPage]);

  const fetchPeople = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      };
      
      const response = await personAPI.getAll(params);
      setPeople(response.data.results || response.data);
      setPagination({
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (error) {
      console.error('Error fetching people:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">People</h1>
        <p className="text-gray-600">
          Meet {pagination.count} key people in Ethiopia's startup ecosystem
        </p>
      </div>

      {/* Search */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search people..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* People Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {people.map((person) => (
              <div key={person.id} className="card">
                <div className="card-body">
                  {/* Person Header */}
                  <div className="flex items-start gap-4 mb-4">
                    {person.profile_picture ? (
                      <img
                        src={person.profile_picture}
                        alt={person.full_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="text-gray-400" size={24} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {person.full_name}
                      </h3>
                      {person.email && (
                        <p className="text-sm text-gray-600 mb-2">{person.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {person.bio && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {person.bio}
                    </p>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    {person.email && (
                      <a
                        href={`mailto:${person.email}`}
                        className="text-gray-400 hover:text-primary-600 transition-colors"
                        title="Email"
                      >
                        <Mail size={18} />
                      </a>
                    )}
                    {person.linkedin_url && (
                      <a
                        href={person.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-600 transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin size={18} />
                      </a>
                    )}
                    {person.twitter_url && (
                      <a
                        href={person.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-600 transition-colors"
                        title="Twitter"
                      >
                        <Twitter size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.count > 20 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!pagination.previous}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {Math.ceil(pagination.count / 20)}
              </span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!pagination.next}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PeoplePage;