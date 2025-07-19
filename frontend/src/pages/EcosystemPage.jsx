import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Building2, Users, DollarSign, MapPin, 
  Globe, Target, Award, Zap, ArrowUpRight 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter
} from 'recharts';
import axios from 'axios';

const EcosystemPage = () => {
  const [ecosystemData, setEcosystemData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEcosystemData();
  }, []);

  const fetchEcosystemData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/ecosystem/');
      setEcosystemData(response.data);
    } catch (error) {
      console.error('Error fetching ecosystem data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#84cc16', '#f97316'];

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ecosystem Overview</h1>
        <p className="text-gray-600">
          Comprehensive analysis of Ethiopia's startup and innovation ecosystem
        </p>
      </div>

      {/* Hero Stats */}
      {ecosystemData?.overview && (
        <div className="dealroom-hero rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{ecosystemData.overview.total_companies}</div>
              <div className="text-blue-100">Total Companies</div>
              <div className="flex items-center justify-center mt-2">
                <ArrowUpRight className="text-green-400" size={16} />
                <span className="text-green-400 text-sm ml-1">
                  {ecosystemData.overview.growth_rate.toFixed(1)}% growth
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{formatCurrency(ecosystemData.overview.total_funding)}</div>
              <div className="text-blue-100">Total Funding</div>
              <div className="text-green-400 text-sm mt-2">
                {formatCurrency(ecosystemData.overview.funding_this_year)} this year
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{ecosystemData.overview.companies_this_year}</div>
              <div className="text-blue-100">New Companies (2024)</div>
              <div className="text-blue-200 text-sm mt-2">
                vs {ecosystemData.overview.companies_last_year} in 2023
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {Math.round(ecosystemData.overview.total_funding / ecosystemData.overview.total_companies)}
              </div>
              <div className="text-blue-100">Avg Funding per Company</div>
              <div className="text-blue-200 text-sm mt-2">USD</div>
            </div>
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="card-body text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-blue-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Growing Momentum</h3>
            <p className="text-gray-600">
              Ethiopia's startup ecosystem is experiencing rapid growth with increasing investor interest and government support.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-green-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Strategic Focus</h3>
            <p className="text-gray-600">
              Key sectors include fintech, agtech, and e-commerce, addressing local market needs and opportunities.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-yellow-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Innovation Hub</h3>
            <p className="text-gray-600">
              Addis Ababa is emerging as a major innovation hub in East Africa, attracting talent and investment.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Industries */}
        {ecosystemData?.top_industries && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Top Industries by Company Count</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ecosystemData.top_industries} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="company_count" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Geographic Distribution */}
        {ecosystemData?.geographic_distribution && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Geographic Distribution</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ecosystemData.geographic_distribution.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ hq_city, hq_country, count }) => `${hq_city || hq_country}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="hq_city"
                  >
                    {ecosystemData.geographic_distribution.slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Industry Deep Dive */}
      {ecosystemData?.top_industries && (
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Industry Analysis</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ecosystemData.top_industries.slice(0, 6).map((industry, index) => (
                <div key={industry.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <h4 className="font-semibold text-gray-900">{industry.name}</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Companies:</span>
                      <span className="font-medium">{industry.company_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Funding:</span>
                      <span className="font-medium">{formatCurrency(industry.total_funding)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg per Company:</span>
                      <span className="font-medium">
                        {formatCurrency(industry.total_funding / Math.max(industry.company_count, 1))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Geographic Insights */}
      {ecosystemData?.geographic_distribution && (
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Regional Ecosystem Hubs</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ecosystemData.geographic_distribution.slice(0, 10).map((location, index) => (
                <div key={`${location.hq_city}-${location.hq_country}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MapPin className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {location.hq_city ? `${location.hq_city}, ${location.hq_country}` : location.hq_country}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(location.total_funding || 0)} total funding
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{location.count}</p>
                    <p className="text-sm text-gray-600">companies</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ecosystem Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body text-center">
            <Building2 className="mx-auto text-blue-600 mb-3" size={32} />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {ecosystemData?.overview?.total_companies || 0}
            </div>
            <div className="text-sm text-gray-600">Active Startups</div>
            <div className="text-xs text-green-600 mt-1">
              +{ecosystemData?.overview?.companies_this_year || 0} this year
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <DollarSign className="mx-auto text-green-600 mb-3" size={32} />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(ecosystemData?.overview?.funding_this_year || 0)}
            </div>
            <div className="text-sm text-gray-600">2024 Funding</div>
            <div className="text-xs text-blue-600 mt-1">
              {Math.round((ecosystemData?.overview?.funding_this_year || 0) / Math.max(ecosystemData?.overview?.companies_this_year || 1, 1))} avg per company
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <TrendingUp className="mx-auto text-yellow-600 mb-3" size={32} />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {ecosystemData?.overview?.growth_rate?.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-gray-600">Growth Rate</div>
            <div className="text-xs text-gray-500 mt-1">Year over year</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <Globe className="mx-auto text-purple-600 mb-3" size={32} />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {ecosystemData?.geographic_distribution?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Cities</div>
            <div className="text-xs text-gray-500 mt-1">With startups</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="card bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="card-body text-center">
          <h3 className="text-2xl font-bold mb-4">Join Ethiopia's Growing Ecosystem</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Whether you're an entrepreneur, investor, or ecosystem builder, there are opportunities 
            to contribute to and benefit from Ethiopia's dynamic startup landscape.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn bg-white text-blue-600 hover:bg-gray-100">
              Explore Companies
            </button>
            <button className="btn border-white text-white hover:bg-white hover:text-blue-600">
              Connect with Investors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcosystemPage;