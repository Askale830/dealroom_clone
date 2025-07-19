import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, DollarSign, Target, Users, Building2, 
  Calendar, ArrowUpRight, PieChart, BarChart3, Award 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import axios from 'axios';

const InvestmentPage = () => {
  const [investmentData, setInvestmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestmentData();
  }, []);

  const fetchInvestmentData = async () => {
    try {
      // Fetch data from multiple endpoints
      const [companiesRes, investorsRes, fundingRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/companies/statistics/'),
        axios.get('http://127.0.0.1:8000/api/investors/'),
        axios.get('http://127.0.0.1:8000/api/funding-rounds/')
      ]);

      const companies = companiesRes.data;
      const investors = investorsRes.data.results || investorsRes.data;
      const fundingRounds = fundingRes.data.results || fundingRes.data;

      // Process investment data
      const currentYear = new Date().getFullYear();
      const thisYearRounds = fundingRounds.filter(round => 
        new Date(round.announced_date).getFullYear() === currentYear
      );

      // Investment by stage
      const stageData = fundingRounds.reduce((acc, round) => {
        acc[round.round_type] = (acc[round.round_type] || 0) + (round.money_raised_usd || 0);
        return acc;
      }, {});

      // Monthly investment trend
      const monthlyData = thisYearRounds.reduce((acc, round) => {
        const month = new Date(round.announced_date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + (round.money_raised_usd || 0);
        return acc;
      }, {});

      // Top investors by deal count
      const investorDeals = {};
      fundingRounds.forEach(round => {
        round.investors_detail?.forEach(participation => {
          const investorName = participation.investor.name;
          investorDeals[investorName] = (investorDeals[investorName] || 0) + 1;
        });
      });

      const topInvestors = Object.entries(investorDeals)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([name, deals]) => ({ name, deals }));

      setInvestmentData({
        overview: {
          totalInvestment: companies.total_funding_usd || 0,
          totalDeals: fundingRounds.length,
          activeInvestors: investors.length,
          avgDealSize: (companies.total_funding_usd || 0) / Math.max(fundingRounds.length, 1),
          thisYearDeals: thisYearRounds.length,
          thisYearInvestment: thisYearRounds.reduce((sum, round) => sum + (round.money_raised_usd || 0), 0)
        },
        stageData: Object.entries(stageData).map(([stage, amount]) => ({ stage, amount })),
        monthlyData: Object.entries(monthlyData).map(([month, amount]) => ({ month, amount })),
        topInvestors,
        recentDeals: fundingRounds.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching investment data:', error);
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

  const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#84cc16'];

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Landscape</h1>
        <p className="text-gray-600">
          Comprehensive overview of investment activity and opportunities in Ethiopia's startup ecosystem
        </p>
      </div>

      {/* Key Metrics */}
      {investmentData?.overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Investment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(investmentData.overview.totalInvestment)}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="text-green-500" size={16} />
                  <span className="text-sm text-green-600 ml-1">
                    {formatCurrency(investmentData.overview.thisYearInvestment)} this year
                  </span>
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
                <p className="text-sm text-gray-600 mb-1">Total Deals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {investmentData.overview.totalDeals}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="text-green-500" size={16} />
                  <span className="text-sm text-green-600 ml-1">
                    {investmentData.overview.thisYearDeals} this year
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
                <p className="text-sm text-gray-600 mb-1">Active Investors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {investmentData.overview.activeInvestors}
                </p>
                <div className="flex items-center mt-2">
                  <Users className="text-gray-400" size={16} />
                  <span className="text-sm text-gray-600 ml-1">Ecosystem participants</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Deal Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(investmentData.overview.avgDealSize)}
                </p>
                <div className="flex items-center mt-2">
                  <Target className="text-gray-400" size={16} />
                  <span className="text-sm text-gray-600 ml-1">Per transaction</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Target className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="card-body text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-white" size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Early Stage Opportunities</h3>
            <p className="text-gray-600 mb-4">
              High-growth potential startups seeking seed and Series A funding
            </p>
            <Link to="/companies?status=Operating" className="btn btn-primary btn-sm">
              Explore Startups
            </Link>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="card-body text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-white" size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Growth Stage Investments</h3>
            <p className="text-gray-600 mb-4">
              Established companies ready for scaling and expansion
            </p>
            <Link to="/companies?funding_stage=Series+A" className="btn btn-primary btn-sm">
              View Growth Companies
            </Link>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="card-body text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-white" size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Impact Investments</h3>
            <p className="text-gray-600 mb-4">
              Companies creating positive social and environmental impact
            </p>
            <Link to="/sectors" className="btn btn-primary btn-sm">
              Explore Sectors
            </Link>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Investment by Stage */}
        {investmentData?.stageData && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Investment by Stage</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={investmentData.stageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ stage, amount }) => `${stage}: ${formatCurrency(amount)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="stage"
                  >
                    {investmentData.stageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Investment']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Monthly Investment Trend */}
        {investmentData?.monthlyData && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">2024 Investment Trend</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={investmentData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Investment']} />
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
        )}
      </div>

      {/* Top Investors */}
      {investmentData?.topInvestors && (
        <div className="card mb-8">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Most Active Investors</h3>
              <Link to="/investors" className="btn btn-outline btn-sm">
                View All Investors
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {investmentData.topInvestors.map((investor, index) => (
                <div key={investor.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{investor.name}</p>
                      <p className="text-sm text-gray-600">{investor.deals} deals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${(investor.deals / investmentData.topInvestors[0].deals) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Investment Activity */}
      {investmentData?.recentDeals && (
        <div className="card mb-8">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Investment Activity</h3>
              <Link to="/transactions" className="btn btn-outline btn-sm">
                View All Transactions
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {investmentData.recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Link
                        to={`/companies/${deal.company_slug || '#'}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {deal.company_name}
                      </Link>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {deal.round_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(deal.announced_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{deal.investors_detail?.length || 0} investors</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(deal.money_raised_usd)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Investment Guide */}
      <div className="card bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="card-body">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Investment Guide</h3>
              <p className="text-gray-300 mb-6">
                Get insights into Ethiopia's investment landscape, due diligence processes, 
                and regulatory environment to make informed investment decisions.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Market analysis and trends</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Legal and regulatory framework</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Due diligence best practices</span>
                </div>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <button className="btn bg-white text-gray-900 hover:bg-gray-100 mb-4">
                Download Investment Guide
              </button>
              <p className="text-sm text-gray-400">
                Comprehensive 50-page guide to investing in Ethiopia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPage;
