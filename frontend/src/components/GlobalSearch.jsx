import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, Users, TrendingUp, X } from 'lucide-react';
import { companyAPI, investorAPI, personAPI } from '../services/api';

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    companies: [],
    investors: [],
    people: []
  });
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchAll = async () => {
      if (query.length < 2) {
        setResults({ companies: [], investors: [], people: [] });
        return;
      }

      setLoading(true);
      try {
        const [companiesRes, investorsRes, peopleRes] = await Promise.all([
          companyAPI.getAll({ search: query, page_size: 5 }),
          investorAPI.getAll({ search: query, page_size: 5 }),
          personAPI.getAll({ search: query, page_size: 5 })
        ]);

        setResults({
          companies: companiesRes.data.results || companiesRes.data,
          investors: investorsRes.data.results || investorsRes.data,
          people: peopleRes.data.results || peopleRes.data
        });
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchAll, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const totalResults = results.companies.length + results.investors.length + results.people.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search companies, investors, people..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center">
              <div className="loading"></div>
            </div>
          )}

          {!loading && query.length >= 2 && totalResults === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Search className="mx-auto mb-4 text-gray-300" size={48} />
              <p>No results found for "{query}"</p>
            </div>
          )}

          {!loading && totalResults > 0 && (
            <div className="p-4 space-y-6">
              {/* Companies */}
              {results.companies.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Companies ({results.companies.length})
                  </h3>
                  <div className="space-y-2">
                    {results.companies.map((company) => (
                      <Link
                        key={company.id}
                        to={`/companies/${company.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                            <Building2 className="text-gray-400" size={16} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{company.name}</p>
                          {company.short_description && (
                            <p className="text-sm text-gray-600 truncate">{company.short_description}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Investors */}
              {results.investors.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Investors ({results.investors.length})
                  </h3>
                  <div className="space-y-2">
                    {results.investors.map((investor) => (
                      <Link
                        key={investor.id}
                        to={`/investors/${investor.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {investor.logo ? (
                          <img
                            src={investor.logo}
                            alt={investor.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                            <TrendingUp className="text-gray-400" size={16} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{investor.name}</p>
                          <p className="text-sm text-gray-600">
                            {investor.investor_type === 'VC' ? 'Venture Capital' : investor.investor_type}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* People */}
              {results.people.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    People ({results.people.length})
                  </h3>
                  <div className="space-y-2">
                    {results.people.map((person) => (
                      <div
                        key={person.id}
                        className="flex items-center gap-3 p-3 rounded-lg"
                      >
                        {person.profile_picture ? (
                          <img
                            src={person.profile_picture}
                            alt={person.full_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="text-gray-400" size={16} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{person.full_name}</p>
                          {person.bio && (
                            <p className="text-sm text-gray-600 truncate">{person.bio}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
