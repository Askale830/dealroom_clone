import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Building2, DollarSign, Users } from 'lucide-react';
import axios from 'axios';

const SectorsPage = () => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSectors();
  }, []);

  const fetchSectors = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/industries/sectors/');
      setSectors(response.data);
    } catch (error) {
      console.error('Error fetching sectors:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sectors</h1>
        <p className="text-gray-600">
          Explore different industry sectors in Ethiopia's startup ecosystem
        </p>
      </div>

      {/* Sectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectors.map((sector) => (
          <Link
            key={sector.id}
            to={`/industries?sector=${sector.id}`}
            className="card hover:shadow-lg transition-all duration-300"
          >
            <div className="card-body">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {sector.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {sector.description || 'No description available'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center ml-4">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Building2 className="text-gray-600" size={16} />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {sector.company_count}
                  </p>
                  <p className="text-xs text-gray-600">Companies</p>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="text-gray-600" size={16} />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {sector.sub_industries?.length || 0}
                  </p>
                  <p className="text-xs text-gray-600">Sub-sectors</p>
                </div>
              </div>

              {/* Sub-industries */}
              {sector.sub_industries && sector.sub_industries.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Sub-sectors:</p>
                  <div className="flex flex-wrap gap-1">
                    {sector.sub_industries.slice(0, 3).map((sub) => (
                      <span
                        key={sub.id}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                      >
                        {sub.name}
                      </span>
                    ))}
                    {sector.sub_industries.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{sector.sub_industries.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {sectors.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sectors found</h3>
          <p className="text-gray-600">
            Sectors will appear here as they are added to the system.
          </p>
        </div>
      )}
    </div>
  );
};

export default SectorsPage;
