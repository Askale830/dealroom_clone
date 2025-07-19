import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { companyAPI } from '../services/api';
import { 
  Building2, MapPin, Calendar, DollarSign, Users, Globe, 
  Linkedin, Twitter, Facebook, Instagram, ExternalLink, Mail, Phone 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CompanyDetailPage = () => {
  const { slug } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        // Since we're using slug, we need to find the company by slug
        // For now, we'll get all companies and find by slug
        const response = await companyAPI.getAll({ search: slug });
        const companies = response.data.results || response.data;
        const foundCompany = companies.find(c => c.slug === slug);
        
        if (foundCompany) {
          // Get full company details
          const detailResponse = await companyAPI.getById(foundCompany.id);
          setCompany(detailResponse.data);
        } else {
          setError('Company not found');
        }
      } catch (error) {
        console.error('Error fetching company:', error);
        setError('Failed to load company details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCompany();
    }
  }, [slug]);

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operating': return 'bg-green-100 text-green-800';
      case 'Acquired': return 'bg-blue-100 text-blue-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      case 'IPO': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const prepareFundingData = (fundingRounds) => {
    return fundingRounds
      .filter(round => round.money_raised_usd)
      .sort((a, b) => new Date(a.announced_date) - new Date(b.announced_date))
      .map(round => ({
        date: new Date(round.announced_date).toLocaleDateString(),
        amount: round.money_raised_usd,
        round_type: round.round_type,
      }));
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

  if (error || !company) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The company you are looking for does not exist.'}</p>
          <Link to="/companies" className="btn btn-primary">
            Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  const fundingData = prepareFundingData(company.funding_rounds || []);

  // Custom highlight for Ministry of Innovation and Technology
  const isMinT = company.slug === 'ministry_of_innovation_and_technology';

  return (
    <div className="container py-8">
      {/* MinT Highlight Banner */}
      {isMinT && (
        <div style={{
          background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)',
          borderRadius: '1.5rem',
          padding: '2.5rem 2rem',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          color: '#fff',
          boxShadow: '0 4px 32px 0 rgba(16,30,54,0.10)',
        }}>
          <img src="https://storage.googleapis.com/dealroom-images-production/29/MTAwOjEwMDpjb21wYW55QHMzLWV1LXdlc3QtMS5hbWF6b25hd3MuY29tL2RlYWxyb29tLWltYWdlcy8yMDI0LzAyLzIwLzUwZGYyOTY0YTg5ZDU4ZDc2NTAzNDJjNThhYzQ4MzA1.png" alt="Ministry of Innovation and Technology" style={{width:80,height:80,objectFit:'contain',borderRadius:16,background:'#fff',padding:8,boxShadow:'0 2px 12px 0 rgba(16,30,54,0.10)'}} />
          <div>
            <h1 style={{fontSize:'2rem',fontWeight:800,marginBottom:8}}>Ministry of Innovation and Technology</h1>
            <p style={{fontSize:'1.15rem',color:'#e0e7ef',maxWidth:520}}>Government body supporting innovation, technology, and the digital ecosystem in Ethiopia.</p>
          </div>
        </div>
      )}

      {/* Company Header */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="flex items-start gap-6">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Building2 className="text-gray-400" size={32} />
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
                  {company.short_description && (
                    <p className="text-lg text-gray-600 mb-3">{company.short_description}</p>
                  )}
                  <div className="flex items-center gap-4 flex-wrap">
                    {company.status && (
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(company.status)}`}>
                        {company.status}
                      </span>
                    )}
                    {company.company_type && (
                      <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                        {company.company_type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {company.website && (
                    <a
                      href={company.website}
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
                {company.founded_date && (
                  <div>
                    <p className="text-sm text-gray-600">Founded</p>
                    <p className="font-semibold">{new Date(company.founded_date).getFullYear()}</p>
                  </div>
                )}
                {company.employee_count_range && (
                  <div>
                    <p className="text-sm text-gray-600">Employees</p>
                    <p className="font-semibold">{company.employee_count_range}</p>
                  </div>
                )}
                {company.total_funding_raised_usd && (
                  <div>
                    <p className="text-sm text-gray-600">Total Funding</p>
                    <p className="font-semibold">{formatCurrency(company.total_funding_raised_usd)}</p>
                  </div>
                )}
                {(company.hq_city || company.hq_country) && (
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">
                      {[company.hq_city, company.hq_country].filter(Boolean).join(', ')}
                    </p>
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
          {company.description && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold">About</h2>
              </div>
              <div className="card-body">
                <p className="text-gray-700 leading-relaxed">{company.description}</p>
              </div>
            </div>
          )}

          {/* Funding History */}
          {company.funding_rounds && company.funding_rounds.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold">Funding History</h2>
              </div>
              <div className="card-body">
                {/* Funding Chart */}
                {fundingData.length > 1 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Funding Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={fundingData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                        <Tooltip 
                          formatter={(value) => [formatCurrency(value), 'Amount Raised']}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#0ea5e9" 
                          strokeWidth={2}
                          dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Funding Rounds List */}
                <div className="space-y-4">
                  {company.funding_rounds.map((round) => (
                    <div key={round.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{round.round_type}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(round.announced_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {round.money_raised_usd && (
                            <p className="font-semibold text-lg">
                              {formatCurrency(round.money_raised_usd)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {round.investors_detail && round.investors_detail.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Investors:</p>
                          <div className="flex flex-wrap gap-2">
                            {round.investors_detail.map((participation) => (
                              <span
                                key={participation.investor.id}
                                className={`px-2 py-1 text-xs rounded ${
                                  participation.is_lead_investor
                                    ? 'bg-primary-100 text-primary-800'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {participation.investor.name}
                                {participation.is_lead_investor && ' (Lead)'}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Team */}
          {((company.founders && company.founders.length > 0) || 
            (company.key_people && company.key_people.length > 0)) && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold">Team</h2>
              </div>
              <div className="card-body">
                {company.founders && company.founders.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Founders</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {company.founders.map((founder) => (
                        <div key={founder.id} className="flex items-center gap-3">
                          {founder.profile_picture ? (
                            <img
                              src={founder.profile_picture}
                              alt={founder.full_name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="text-gray-400" size={20} />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{founder.full_name}</p>
                            <p className="text-sm text-gray-600">Founder</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {company.key_people && company.key_people.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Key People</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {company.key_people.map((person) => (
                        <div key={person.id} className="flex items-center gap-3">
                          {person.profile_picture ? (
                            <img
                              src={person.profile_picture}
                              alt={person.full_name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="text-gray-400" size={20} />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{person.full_name}</p>
                            <p className="text-sm text-gray-600">Key Personnel</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Contact Information</h3>
            </div>
            <div className="card-body space-y-3">
              {company.contact_email && (
                <div className="flex items-center gap-3">
                  <Mail className="text-gray-400" size={16} />
                  <a 
                    href={`mailto:${company.contact_email}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {company.contact_email}
                  </a>
                </div>
              )}
              
              {company.phone_number && (
                <div className="flex items-center gap-3">
                  <Phone className="text-gray-400" size={16} />
                  <span className="text-gray-700">{company.phone_number}</span>
                </div>
              )}

              {(company.hq_city || company.hq_country) && (
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={16} />
                  <span className="text-gray-700">
                    {[company.hq_city, company.hq_country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          {(company.linkedin_url || company.twitter_url || company.facebook_url || 
            company.instagram_url || company.crunchbase_url || company.angellist_url) && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold">Social Links</h3>
              </div>
              <div className="card-body space-y-3">
                {company.linkedin_url && (
                  <a
                    href={company.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-primary-600"
                  >
                    <Linkedin size={16} />
                    LinkedIn
                    <ExternalLink size={12} />
                  </a>
                )}
                
                {company.twitter_url && (
                  <a
                    href={company.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-primary-600"
                  >
                    <Twitter size={16} />
                    Twitter
                    <ExternalLink size={12} />
                  </a>
                )}

                {company.facebook_url && (
                  <a
                    href={company.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-primary-600"
                  >
                    <Facebook size={16} />
                    Facebook
                    <ExternalLink size={12} />
                  </a>
                )}

                {company.crunchbase_url && (
                  <a
                    href={company.crunchbase_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-primary-600"
                  >
                    <ExternalLink size={16} />
                    Crunchbase
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Industries */}
          {company.industries && company.industries.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold">Industries</h3>
              </div>
              <div className="card-body">
                <div className="flex flex-wrap gap-2">
                  {company.industries.map((industry) => (
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
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
