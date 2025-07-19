import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fundingRoundAPI } from '../services/api';
import { Search, Calendar, DollarSign, TrendingUp, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const FundingPage = () => {
  const [fundingRounds, setFundingRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    round_type: '',
  });
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchFundingRounds();
  }, [filters, currentPage]);

  const fetchFundingRounds = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      };
      
      const response = await fundingRoundAPI.getAll(params);
      setFundingRounds(response.data.results || response.data);
      setPagination({
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (error) {
      console.error('Error fetching funding rounds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRoundTypeColor = (type) => {
    switch (type) {
      case 'Seed': return 'bg-green-100 text-green-800';
      case 'Pre-Seed': return 'bg-yellow-100 text-yellow-800';
      case 'Series A': return 'bg-blue-100 text-blue-800';
      case 'Series B': return 'bg-purple-100 text-purple-800';
      case 'Series C': return 'bg-indigo-100 text-indigo-800';
      case 'Grant': return 'bg-orange-100 text-orange-800';
      case 'IPO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Prepare data for charts
  const roundTypeData = fundingRounds.reduce((acc, round) => {
    const type = round.round_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(roundTypeData).map(([type, count]) => ({
    type,
    count,
  }));

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Funding Rounds</h1>
        <p className="text-gray-600">
          Track {pagination.count} funding rounds in Ethiopia's startup ecosystem
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Rounds</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.count}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-primary-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Funding</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    fundingRounds.reduce((sum, round) => sum + (round.money_raised_usd || 0), 0)
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-success-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Year</p>
                <p className="text-2xl font-bold text-gray-900">
                  {fundingRounds.filter(round => 
                    new Date(round.announced_date).getFullYear() === new Date().getFullYear()
                  ).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-warning-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Round Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    fundingRounds.filter(r => r.money_raised_usd).length > 0
                      ? fundingRounds.reduce((sum, round) => sum + (round.money_raised_usd || 0), 0) /
                        fundingRounds.filter(r => r.money_raised_usd).length
                      : 0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
                <Building2 className="text-error-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Round Types Bar Chart */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Funding Rounds by Type</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Round Types Pie Chart */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Round Type Distribution</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, count }) => `${type}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="type"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search companies or notes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Round Type Filter */}
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filters.round_type}
              onChange={(e) => handleFilterChange('round_type', e.target.value)}
            >
              <option value="">All Round Types</option>
              <option value="Pre-Seed">Pre-Seed</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Series C">Series C</option>
              <option value="Series D+">Series D+</option>
              <option value="Grant">Grant</option>
              <option value="Angel">Angel</option>
              <option value="IPO">IPO</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Funding Rounds List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {fundingRounds.map((round) => (
              <div key={round.id} className="card">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          to={`/companies/${round.company?.slug || '#'}`}
                          className="text-xl font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {round.company?.name || 'Unknown Company'}
                        </Link>
                        <span className={`px-2 py-1 text-xs rounded-full ${getRoundTypeColor(round.round_type)}`}>
                          {round.round_type}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{new Date(round.announced_date).toLocaleDateString()}</span>
                        </div>
                        {round.money_raised_usd && (
                          <div className="flex items-center gap-1">
                            <DollarSign size={16} />
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(round.money_raised_usd)}
                            </span>
                          </div>
                        )}
                      </div>

                      {round.notes && (
                        <p className="text-gray-700 mb-3">{round.notes}</p>
                      )}

                      {round.investors_detail && round.investors_detail.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Investors ({round.investors_detail.length}):
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {round.investors_detail.map((participation) => (
                              <Link
                                key={participation.investor.id}
                                to={`/investors/${participation.investor.slug}`}
                                className={`px-2 py-1 text-xs rounded hover:opacity-80 ${
                                  participation.is_lead_investor
                                    ? 'bg-primary-100 text-primary-800'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {participation.investor.name}
                                {participation.is_lead_investor && ' (Lead)'}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Valuation Info */}
                    {(round.pre_money_valuation_usd || round.post_money_valuation_usd) && (
                      <div className="text-right text-sm">
                        {round.pre_money_valuation_usd && (
                          <div className="text-gray-600">
                            Pre-money: {formatCurrency(round.pre_money_valuation_usd)}
                          </div>
                        )}
                        {round.post_money_valuation_usd && (
                          <div className="text-gray-600">
                            Post-money: {formatCurrency(round.post_money_valuation_usd)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {round.source_url && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <a
                        href={round.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        View Source →
                      </a>
                    </div>
                  )}
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

export default FundingPage;