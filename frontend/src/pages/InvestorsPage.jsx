import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { investorAPI } from '../services/api'; // Removed unused industryAPI
import { Search, Building2, MapPin, DollarSign, TrendingUp } from 'lucide-react';

const InvestorsPage = () => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    investor_type: '',
    hq_country: '',
  });
  const [pagination, setPagination] = useState({
    count: 0, // Corrected: only one count
    next: null,
    previous: null,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchInvestors();
  }, [filters, currentPage]);

  const fetchInvestors = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        ...Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== '') // Corrected: ignore key
        ),
      };
      
      const investorData = await investorAPI.getAll(params);
      setInvestors(Array.isArray(investorData.results) ? investorData.results : []);
      setPagination({
        count: investorData.count || 0,
        next: investorData.next,
        previous: investorData.previous,
        totalPages: Math.ceil((investorData.count || 0) / 20), // Assuming PAGE_SIZE 20
      });
    } catch (error) {
      console.error('Error fetching investors:', error);
      setInvestors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const getInvestorTypeColor = (type) => {
    switch (type) {
      case 'VC': return 'bg-blue-100 text-blue-800';
      case 'Angel': return 'bg-green-100 text-green-800';
      case 'PE': return 'bg-purple-100 text-purple-800';
      case 'Corporate': return 'bg-orange-100 text-orange-800';
      case 'Accelerator': return 'bg-yellow-100 text-yellow-800';
      case 'Government': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Investors</h1>
        <p className="text-gray-600">
          Discover {pagination.count} investors in Ethiopia's startup ecosystem
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search investors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Investor Type Filter */}
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.investor_type}
              onChange={(e) => handleFilterChange('investor_type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="VC">Venture Capital</option>
              <option value="Angel">Angel Investor</option>
              <option value="PE">Private Equity</option>
              <option value="Corporate">Corporate VC</option>
              <option value="Accelerator">Accelerator</option>
              <option value="Government">Government Fund</option>
              <option value="FamilyOffice">Family Office</option>
              <option value="Other">Other</option>
            </select>

            {/* Country Filter */}
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.hq_country}
              onChange={(e) => handleFilterChange('hq_country', e.target.value)}
            >
              <option value="">All Countries</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Kenya">Kenya</option>
              <option value="Nigeria">Nigeria</option>
              <option value="South Africa">South Africa</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </div>
        </div>
      </div>

      {/* Investors Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading"></div>
        </div>
      ) : (
        <>
          {investors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {investors.map((investor) => (
                <Link
                  key={investor.id || investor.slug} // Use slug as fallback key
                  to={`/investors/${investor.slug}`}
                  className="card hover:shadow-md transition-shadow"
                >
                  <div className="card-body">
                    {/* Investor Header */}
                    <div className="flex items-start gap-4 mb-4">
                      {investor.logo ? (
                        <img
                          src={investor.logo}
                          alt={investor.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Building2 className="text-gray-400" size={24} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {investor.name}
                        </h3>
                        {investor.investor_type && (
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getInvestorTypeColor(investor.investor_type)}`}>
                            {investor.investor_type_display || investor.investor_type}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Investor Description */}
                    {investor.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {investor.description}
                      </p>
                    )}

                    {/* Investor Details */}
                    <div className="space-y-2 text-sm text-gray-600">
                      {(investor.hq_city || investor.hq_country) && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>
                            {[investor.hq_city, investor.hq_country].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                      
                      {investor.funding_stages_focus && (
                        <div className="flex items-center gap-2">
                          <TrendingUp size={16} />
                          <span>Focus: {investor.funding_stages_focus}</span>
                        </div>
                      )}
                    </div>

                    {/* Focus Industries */}
                    {investor.industries_focus && investor.industries_focus.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {investor.industries_focus.slice(0, 3).map((industry) => (
                          <span
                            key={industry.id}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {industry.name}
                          </span>
                        ))}
                        {investor.industries_focus.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{investor.industries_focus.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
             !loading && ( // Only show "no investors" if not loading and no investors
                <div className="text-center py-12">
                  <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No investors found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or be the first to add an investor.
                  </p>
                </div>
              )
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === pagination.totalPages || loading}
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

export default InvestorsPage;