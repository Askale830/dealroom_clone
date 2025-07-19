import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { investorAPI } from '../services/api';
import { 
  Building2, MapPin, Globe, Linkedin, ExternalLink, Mail, 
  TrendingUp, DollarSign, Users 
} from 'lucide-react';

const InvestorDetailPage = () => {
  const { slug } = useParams();
  const [investor, setInvestor] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvestor = async () => {
      try {
        // Since we're using slug, we need to find the investor by slug
        const response = await investorAPI.getAll({ search: slug });
        const investors = response.data.results || response.data;
        const foundInvestor = investors.find(i => i.slug === slug);
        
        if (foundInvestor) {
          // Get full investor details
          const detailResponse = await investorAPI.getById(foundInvestor.id);
          setInvestor(detailResponse.data);
          
          // Fetch portfolio
          setPortfolioLoading(true);
          const portfolioResponse = await investorAPI.getPortfolio(foundInvestor.id);
          setPortfolio(portfolioResponse.data);
        } else {
          setError('Investor not found');
        }
      } catch (error) {
        console.error('Error fetching investor:', error);
        setError('Failed to load investor details');
      } finally {
        setLoading(false);
        setPortfolioLoading(false);
      }
    };

    if (slug) {
      fetchInvestor();
    }
  }, [slug]);

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

  const getInvestorTypeLabel = (type) => {
    switch (type) {
      case 'VC': return 'Venture Capital';
      case 'PE': return 'Private Equity';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <div className="loading"></div>
        </div>
      </div>
    );
  }

  if (error || !investor) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Investor Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The investor you are looking for does not exist.'}</p>
          <Link to="/investors" className="btn btn-primary">
            Back to Investors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Investor Header */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="flex items-start gap-6">
            {/* Investor Logo */}
            <div className="flex-shrink-0">
              {investor.logo ? (
                <img
                  src={investor.logo}
                  alt={investor.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Building2 className="text-gray-400" size={32} />
                </div>
              )}
            </div>

            {/* Investor Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{investor.name}</h1>
                  <div className="flex items-center gap-4 flex-wrap mb-3">
                    {investor.investor_type && (
                      <span className={`px-3 py-1 text-sm rounded-full ${getInvestorTypeColor(investor.investor_type)}`}>
                        {getInvestorTypeLabel(investor.investor_type)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {investor.website && (
                    <a
                      href={investor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <Globe size={16} />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(investor.hq_city || investor.hq_country) && (
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">
                      {[investor.hq_city, investor.hq_country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
                {investor.funding_stages_focus && (
                  <div>
                    <p className="text-sm text-gray-600">Focus Stages</p>
                    <p className="font-semibold">{investor.funding_stages_focus}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Portfolio</p>
                  <p className="font-semibold">{portfolio.length} companies</p>
                </div>
                {investor.industries_focus && investor.industries_focus.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600">Industries</p>
                    <p className="font-semibold">{investor.industries_focus.length} focus areas</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          {investor.description && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold">About</h2>
              </div>
              <div className="card-body">
                <p className="text-gray-700 leading-relaxed">{investor.description}</p>
              </div>
            </div>
          )}

          {/* Portfolio Companies */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold">Portfolio Companies</h2>
            </div>
            <div className="card-body">
              {portfolioLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="loading"></div>
                </div>
              ) : portfolio.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio.map((company) => (
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
                  <p className="text-gray-600">No portfolio companies found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Contact Information</h3>
            </div>
            <div className="card-body space-y-3">
              {investor.contact_email && (
                <div className="flex items-center gap-3">
                  <Mail className="text-gray-400" size={16} />
                  <a 
                    href={`mailto:${investor.contact_email}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {investor.contact_email}
                  </a>
                </div>
              )}

              {(investor.hq_city || investor.hq_country) && (
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={16} />
                  <span className="text-gray-700">
                    {[investor.hq_city, investor.hq_country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          {investor.linkedin_url && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold">Social Links</h3>
              </div>
              <div className="card-body space-y-3">
                <a
                  href={investor.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-primary-600"
                >
                  <Linkedin size={16} />
                  LinkedIn
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}

          {/* Investment Focus */}
          {investor.industries_focus && investor.industries_focus.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold">Industry Focus</h3>
              </div>
              <div className="card-body">
                <div className="flex flex-wrap gap-2">
                  {investor.industries_focus.map((industry) => (
                    <Link
                      key={industry.id}
                      to={`/industries?industry=${industry.id}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200"
                    >
                      {industry.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Investment Stages */}
          {investor.funding_stages_focus && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold">Funding Stages</h3>
              </div>
              <div className="card-body">
                <div className="flex flex-wrap gap-2">
                  {investor.funding_stages_focus.split(',').map((stage, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                    >
                      {stage.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorDetailPage;