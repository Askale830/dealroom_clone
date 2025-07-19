import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { industryAPI, companyAPI } from '../services/api';
import { Search, Building2, TrendingUp } from 'lucide-react';

const IndustriesPage = () => {
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [industryCompanies, setIndustryCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchIndustries();
  }, []);

  useEffect(() => {
    const industryId = searchParams.get('industry');
    if (industryId) {
      const industry = industries.find(i => i.id.toString() === industryId);
      if (industry) {
        setSelectedIndustry(industry);
        fetchIndustryCompanies(industryId);
      }
    }
  }, [searchParams, industries]);

  const fetchIndustries = async () => {
    try {
      const response = await industryAPI.getAll();
      setIndustries(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching industries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndustryCompanies = async (industryId) => {
    setCompaniesLoading(true);
    try {
      const response = await industryAPI.getCompanies(industryId);
      setIndustryCompanies(response.data);
    } catch (error) {
      console.error('Error fetching industry companies:', error);
    } finally {
      setCompaniesLoading(false);
    }
  };

  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry);
    setSearchParams({ industry: industry.id.toString() });
    fetchIndustryCompanies(industry.id);
  };

  const clearSelection = () => {
    setSelectedIndustry(null);
    setIndustryCompanies([]);
    setSearchParams({});
  };

  // Group industries by parent
  const groupedIndustries = industries.reduce((acc, industry) => {
    if (industry.parent_industry) {
      const parentId = industry.parent_industry;
      if (!acc.children[parentId]) {
        acc.children[parentId] = [];
      }
      acc.children[parentId].push(industry);
    } else {
      acc.parents.push(industry);
    }
    return acc;
  }, { parents: [], children: {} });

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <div className="loading"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Industries</h1>
        <p className="text-gray-600">
          Explore companies across different industries in Ethiopia's startup ecosystem
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Industries List */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">All Industries</h2>
              {selectedIndustry && (
                <button
                  onClick={clearSelection}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear Selection
                </button>
              )}
            </div>
            <div className="card-body">
              <div className="space-y-2">
                {groupedIndustries.parents.map((industry) => (
                  <div key={industry.id}>
                    <button
                      onClick={() => handleIndustrySelect(industry)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedIndustry?.id === industry.id
                          ? 'bg-primary-100 text-primary-800'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{industry.name}</span>
                        <TrendingUp size={16} className="text-gray-400" />
                      </div>
                    </button>
                    
                    {/* Child Industries */}
                    {groupedIndustries.children[industry.id] && (
                      <div className="ml-4 mt-1 space-y-1">
                        {groupedIndustries.children[industry.id].map((childIndustry) => (
                          <button
                            key={childIndustry.id}
                            onClick={() => handleIndustrySelect(childIndustry)}
                            className={`w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                              selectedIndustry?.id === childIndustry.id
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {childIndustry.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Industry Details and Companies */}
        <div className="lg:col-span-2">
          {selectedIndustry ? (
            <div className="space-y-6">
              {/* Industry Info */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-semibold">{selectedIndustry.name}</h2>
                </div>
                <div className="card-body">
                  {selectedIndustry.description ? (
                    <p className="text-gray-700">{selectedIndustry.description}</p>
                  ) : (
                    <p className="text-gray-500 italic">No description available for this industry.</p>
                  )}
                  
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building2 size={16} />
                      <span>{industryCompanies.length} companies</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Companies in Industry */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold">
                    Companies in {selectedIndustry.name}
                  </h3>
                </div>
                <div className="card-body">
                  {companiesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="loading"></div>
                    </div>
                  ) : industryCompanies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {industryCompanies.map((company) => (
                        <Link
                          key={company.id}
                          to={`/companies/${company.slug}`}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            {company.logo ? (
                              <img
                                src={company.logo}
                                alt={company.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Building2 className="text-gray-400" size={20} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">
                                {company.name}
                              </h4>
                              {company.short_description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {company.short_description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                {company.status && (
                                  <span>{company.status}</span>
                                )}
                                {company.hq_country && (
                                  <span>{company.hq_country}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-600">No companies found in this industry.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Industry Overview */
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold">Industry Overview</h2>
              </div>
              <div className="card-body">
                <div className="text-center py-12">
                  <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select an Industry
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Choose an industry from the list to view companies and detailed information.
                  </p>
                  
                  {/* Industry Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {groupedIndustries.parents.length}
                      </p>
                      <p className="text-sm text-gray-600">Main Industries</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {Object.values(groupedIndustries.children).flat().length}
                      </p>
                      <p className="text-sm text-gray-600">Sub-Industries</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {industries.length}
                      </p>
                      <p className="text-sm text-gray-600">Total Industries</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndustriesPage;