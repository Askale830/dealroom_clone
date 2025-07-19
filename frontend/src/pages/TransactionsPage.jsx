import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, DollarSign, TrendingUp, Building2, Users, 
  Filter, Download, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import axios from 'axios';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    round_type: '',
    year: '',
    search: ''
  });
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, [filters, currentPage]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      };
      
      const response = await axios.get('http://127.0.0.1:8000/api/funding-rounds/transactions/', { params });
      setTransactions(response.data.results || response.data);
      setPagination({
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/funding-rounds/');
      const allTransactions = response.data.results || response.data;
      
      // Calculate statistics
      const totalAmount = allTransactions.reduce((sum, t) => sum + (t.money_raised_usd || 0), 0);
      const currentYear = new Date().getFullYear();
      const thisYearTransactions = allTransactions.filter(t => 
        new Date(t.announced_date).getFullYear() === currentYear
      );
      const lastYearTransactions = allTransactions.filter(t => 
        new Date(t.announced_date).getFullYear() === currentYear - 1
      );
      
      // Round type distribution
      const roundTypeData = allTransactions.reduce((acc, t) => {
        acc[t.round_type] = (acc[t.round_type] || 0) + (t.money_raised_usd || 0);
        return acc;
      }, {});

      // Monthly trend for current year
      const monthlyData = thisYearTransactions.reduce((acc, t) => {
        const month = new Date(t.announced_date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + (t.money_raised_usd || 0);
        return acc;
      }, {});

      setStats({
        totalAmount,
        totalTransactions: allTransactions.length,
        thisYearCount: thisYearTransactions.length,
        lastYearCount: lastYearTransactions.length,
        avgDealSize: totalAmount / Math.max(allTransactions.length, 1),
        roundTypeData: Object.entries(roundTypeData).map(([type, amount]) => ({ type, amount })),
        monthlyData: Object.entries(monthlyData).map(([month, amount]) => ({ month, amount }))
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
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

  const getRoundTypeColor = (type) => {
    const colors = {
      'Seed': 'bg-green-100 text-green-800',
      'Pre-Seed': 'bg-yellow-100 text-yellow-800',
      'Series A': 'bg-blue-100 text-blue-800',
      'Series B': 'bg-purple-100 text-purple-800',
      'Series C': 'bg-indigo-100 text-indigo-800',
      'Grant': 'bg-orange-100 text-orange-800',
      'IPO': 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading && !stats) {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
        <p className="text-gray-600">
          Track funding transactions and investment activity in Ethiopia's startup ecosystem
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="text-green-500" size={16} />
                  <span className="text-sm text-green-600 ml-1">
                    {((stats.thisYearCount - stats.lastYearCount) / Math.max(stats.lastYearCount, 1) * 100).toFixed(1)}% YoY
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="text-green-500" size={16} />
                  <span className="text-sm text-green-600 ml-1">+15% this quarter</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Deal Size</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgDealSize)}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="text-green-500" size={16} />
                  <span className="text-sm text-green-600 ml-1">+8% vs last year</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Building2 className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Year</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisYearCount}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="text-green-500" size={16} />
                  <span className="text-sm text-green-600 ml-1">vs {stats.lastYearCount} last year</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Trend */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Monthly Transaction Volume</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Volume']} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#2563eb" 
                    fill="#2563eb"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Round Type Distribution */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Funding by Round Type</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.roundTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, amount }) => `${type}: ${formatCurrency(amount)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="type"
                  >
                    {stats.roundTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search companies..."
                className="form-input"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Round Type
              </label>
              <select
                className="form-select"
                value={filters.round_type}
                onChange={(e) => handleFilterChange('round_type', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Pre-Seed">Pre-Seed</option>
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
                <option value="Series C">Series C</option>
                <option value="Grant">Grant</option>
                <option value="IPO">IPO</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                className="form-select"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
              >
                <option value="">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="btn btn-outline w-full">
                <Download size={16} className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="card">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          to={`/companies/${transaction.company_slug || '#'}`}
                          className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                        >
                          {transaction.company_name || 'Unknown Company'}
                        </Link>
                        <span className={`px-2 py-1 text-xs rounded-full ${getRoundTypeColor(transaction.round_type)}`}>
                          {transaction.round_type}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{new Date(transaction.announced_date).toLocaleDateString()}</span>
                        </div>
                        {transaction.money_raised_usd && (
                          <div className="flex items-center gap-1">
                            <DollarSign size={16} />
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(transaction.money_raised_usd)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>{transaction.investors_detail?.length || 0} investors</span>
                        </div>
                      </div>

                      {transaction.investors_detail && transaction.investors_detail.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Investors:</p>
                          <div className="flex flex-wrap gap-2">
                            {transaction.investors_detail.slice(0, 5).map((participation) => (
                              <Link
                                key={participation.investor.id}
                                to={`/investors/${participation.investor.slug}`}
                                className={`px-2 py-1 text-xs rounded hover:opacity-80 ${
                                  participation.is_lead_investor
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {participation.investor.name}
                                {participation.is_lead_investor && ' (Lead)'}
                              </Link>
                            ))}
                            {transaction.investors_detail.length > 5 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                +{transaction.investors_detail.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Valuation Info */}
                    {(transaction.pre_money_valuation_usd || transaction.post_money_valuation_usd) && (
                      <div className="text-right text-sm ml-6">
                        {transaction.pre_money_valuation_usd && (
                          <div className="text-gray-600">
                            Pre: {formatCurrency(transaction.pre_money_valuation_usd)}
                          </div>
                        )}
                        {transaction.post_money_valuation_usd && (
                          <div className="text-gray-600">
                            Post: {formatCurrency(transaction.post_money_valuation_usd)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {transaction.source_url && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <a
                        href={transaction.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700"
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

export default TransactionsPage;
