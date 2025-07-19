import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, Building2, Users, DollarSign, ArrowUpRight,
  ArrowDownRight, Calendar, Target, AlertCircle, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
// import axios from 'axios'; // Replaced with apiService
import { dashboardAPI } from '../services/api'; // Use our apiService
import EthiopiaMap from '../components/EthiopiaMap';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Poll for live updates every 10 seconds
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      // console.log('Fetching dashboard data...'); // Optional: keep for debugging if needed
      
      const data = await dashboardAPI.getStats(); // Use apiService
      
      // console.log('Dashboard data received:', data); // Optional: keep for debugging
      setDashboardData(data);
    } catch (err) { // Renamed error to err to avoid conflict with state variable
      console.error('Error fetching dashboard data:', err);
      
      let errorMessage = 'Failed to fetch dashboard data';
      // Simplified error handling as apiService throws a more generic error
      if (err.message) {
        errorMessage = err.message;
      }
      // Add specific checks if needed, e.g., for network errors not caught by apiService
      // if (err.message.includes('NetworkError')) {
      //   errorMessage = 'Network error. Please check your connection.';
      // }
      
      setError(errorMessage);
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

  const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center max-w-md">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-red-800 mb-2">Dashboard Error</h2>
              <p className="text-red-600 mb-4 text-sm">{error}</p>
              <div className="space-y-2">
                <button 
                  onClick={fetchDashboardData}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
                <Link 
                  to="/test"
                  className="block w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-center"
                >
                  Test API Connection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No dashboard data available</p>
            <button 
              onClick={fetchDashboardData}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Dashboard Layout ---
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 mb-8 flex flex-col items-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Ethiopia in East Africa</h2>
          <EthiopiaMap />
          <div className="text-gray-500 text-sm mt-2 text-center">Ethiopia highlighted in blue. For demo purposes only.</div>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">
            Overview of Ethiopia's startup ecosystem performance
          </p>
        </div>

        {/* Key Metrics */}
        {dashboardData?.overview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Companies */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col items-start justify-between min-h-[140px]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="text-blue-600" size={28} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{dashboardData.overview.total_companies || 0}</div>
                  <div className="text-sm text-gray-500 mt-1">Companies</div>
                </div>
              </div>
            </div>
            {/* Funding */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col items-start justify-between min-h-[140px]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-green-600" size={28} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardData.overview.total_funding || 0)}</div>
                  <div className="text-sm text-gray-500 mt-1">Total Funding</div>
                </div>
              </div>
            </div>
            {/* Investors */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col items-start justify-between min-h-[140px]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="text-purple-600" size={28} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{dashboardData.overview.total_investors || 0}</div>
                  <div className="text-sm text-gray-500 mt-1">Investors</div>
                </div>
              </div>
            </div>
            {/* Active Companies */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col items-start justify-between min-h-[140px]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-yellow-600" size={28} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{dashboardData.overview.active_companies || 0}</div>
                  <div className="text-sm text-gray-500 mt-1">Active Companies</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ecosystem Builder Bar Chart */}
        {dashboardData?.overview && (
          <div className="bg-white rounded-2xl shadow p-8 mb-10 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ecosystem Builders</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={[{
                  name: 'Hubs', value: dashboardData.overview.total_hubs || 0
                }, {
                  name: 'Incubators', value: dashboardData.overview.total_incubators || 0
                }, {
                  name: 'Accelerators', value: dashboardData.overview.total_accelerators || 0
                }, {
                  name: 'Universities', value: dashboardData.overview.total_universities || 0
                }]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Industry Distribution */}
          {dashboardData?.industry_stats && dashboardData.industry_stats.length > 0 ? (
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Companies by Industry</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={dashboardData.industry_stats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, company_count }) => `${name}: ${company_count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="company_count"
                    nameKey="name"
                  >
                    {dashboardData.industry_stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex items-center justify-center min-h-[260px]">
              <div className="text-center text-gray-400">
                <Building2 size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No industry data available</p>
              </div>
            </div>
          )}

          {/* Monthly Funding Trend */}
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex items-center justify-center min-h-[260px]">
            <div className="text-center text-gray-400">
              <TrendingUp size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Monthly funding data coming soon</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Companies */}
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Companies</h3>
              <Link to="/companies" className="btn btn-outline btn-sm">
                View All
              </Link>
            </div>
            {dashboardData?.recent_companies && dashboardData.recent_companies.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recent_companies.map((company) => (
                  <div key={company.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{company.name}</h4>
                      <p className="text-sm text-gray-600">
                        {company.short_description || 'No description available'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {company.hq_city && company.hq_country 
                          ? `${company.hq_city}, ${company.hq_country}`
                          : 'Location not specified'
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building2 size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No recent companies found</p>
                <Link 
                  to="/companies/add" 
                  className="mt-2 inline-block text-blue-600 hover:text-blue-800 underline"
                >
                  Add the first company
                </Link>
              </div>
            )}
          </div>

          {/* Recent Funding */}
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Funding</h3>
              <Link to="/transactions" className="btn btn-outline btn-sm">
                View All
              </Link>
            </div>
            {dashboardData?.recent_funding && dashboardData.recent_funding.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recent_funding.map((round) => (
                  <div key={round.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {round.company_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {round.round_type} • {round.announced_date 
                          ? new Date(round.announced_date).toLocaleDateString()
                          : 'Date not specified'
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(round.money_raised_usd || 0)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {round.investors_detail?.length || 0} investors
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No recent funding rounds found</p>
                <Link 
                  to="/funding" 
                  className="mt-2 inline-block text-blue-600 hover:text-blue-800 underline"
                >
                  Add funding data
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Debug Information (only in development) */}
        {(import.meta.env.MODE === 'development') && dashboardData && (
          <div className="mt-8">
            <details className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <summary className="font-semibold text-yellow-800 cursor-pointer">
                Debug Information (Development Only)
              </summary>
              <pre className="mt-2 text-xs text-yellow-700 overflow-auto max-h-64">
                {JSON.stringify(dashboardData, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;