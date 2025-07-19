import React, { useState, useEffect } from 'react';
import { organizationRegistrationAPI } from '../services/api';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  Calendar,
  Users,
  Building2,
  Filter,
  Search,
  Download
} from 'lucide-react';

const AdminOrganizationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    organization_type: '',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    needs_info: 'bg-blue-100 text-blue-800'
  };

  const statusIcons = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
    needs_info: AlertCircle
  };

  useEffect(() => {
    fetchRegistrations();
  }, [filters]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      console.log('Fetching registrations with filters:', filters);
      const response = await organizationRegistrationAPI.getAll(filters);
      console.log('API response:', response);
      
      if (response && response.results) {
        console.log('Setting registrations:', response.results.length, 'items');
        setRegistrations(response.results);
        
        // Calculate stats
        const stats = response.results.reduce((acc, reg) => {
          acc.total++;
          acc[reg.status] = (acc[reg.status] || 0) + 1;
          return acc;
        }, { total: 0, pending: 0, approved: 0, rejected: 0, needs_info: 0 });
        
        setStats(stats);
      } else {
        console.log('No results in response:', response);
        setRegistrations([]);
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching registrations:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      setError('Failed to load registrations');
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, action, data = {}) => {
    try {
      let response;
      switch (action) {
        case 'approve':
          response = await organizationRegistrationAPI.approve(id);
          break;
        case 'reject':
          response = await organizationRegistrationAPI.reject(id, data.reason);
          break;
        case 'request_info':
          response = await organizationRegistrationAPI.requestInfo(id, data.message);
          break;
        default:
          return;
      }

      if (response.success) {
        // Refresh the list
        fetchRegistrations();
        setSelectedRegistration(null);
      }
    } catch (err) {
      setError(`Failed to ${action} registration`);
      console.error(`Error ${action}ing registration:`, err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrganizationTypeLabel = (type) => {
    const types = {
      startup: 'Startup',
      scaleup: 'Scaleup',
      vc: 'Venture Capital',
      angel: 'Angel Investor',
      accelerator: 'Accelerator',
      incubator: 'Incubator',
      hub: 'Innovation Hub',
      university: 'University',
      government: 'Government Body',
      corporate: 'Corporate',
      ngo: 'NGO/Non-Profit',
      service_provider: 'Service Provider'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading mb-4"></div>
          <p className="text-gray-600">Loading organization registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Organization Registrations</h1>
          <p className="text-gray-600">Manage and review organization registration requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Building2 className="text-blue-600" size={24} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="text-yellow-600" size={24} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="text-green-600" size={24} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircle className="text-red-600" size={24} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search size={16} className="inline mr-1" />
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="form-input"
                placeholder="Search organizations..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="form-input"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="needs_info">Needs Info</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Type
              </label>
              <select
                value={filters.organization_type}
                onChange={(e) => setFilters(prev => ({ ...prev, organization_type: e.target.value }))}
                className="form-input"
              >
                <option value="">All Types</option>
                <option value="startup">Startup</option>
                <option value="scaleup">Scaleup</option>
                <option value="vc">Venture Capital</option>
                <option value="angel">Angel Investor</option>
                <option value="accelerator">Accelerator</option>
                <option value="incubator">Incubator</option>
                <option value="hub">Innovation Hub</option>
                <option value="university">University</option>
                <option value="government">Government</option>
                <option value="corporate">Corporate</option>
                <option value="ngo">NGO/Non-Profit</option>
                <option value="service_provider">Service Provider</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: '', organization_type: '', search: '' })}
                className="btn btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Registrations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((registration) => {
                  const StatusIcon = statusIcons[registration.status];
                  return (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {registration.organization_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin size={12} className="mr-1" />
                            {registration.headquarters}, {registration.country}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {registration.first_name} {registration.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{registration.position}</div>
                          <div className="text-sm text-gray-500">{registration.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getOrganizationTypeLabel(registration.organization_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[registration.status]}`}>
                          <StatusIcon size={12} className="mr-1" />
                          {registration.status_display}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(registration.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedRegistration(registration)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Eye size={16} />
                        </button>
                        {registration.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(registration.id, 'approve')}
                              className="text-green-600 hover:text-green-900 mr-3"
                              title="Approve"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(registration.id, 'reject', { reason: 'Rejected by admin' })}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {registrations.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No registrations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No organization registrations match your current filters.
              </p>
            </div>
          )}
        </div>

        {/* Registration Detail Modal */}
        {selectedRegistration && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedRegistration.organization_name}
                  </h3>
                  <button
                    onClick={() => setSelectedRegistration(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Organization Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Type:</strong> {getOrganizationTypeLabel(selectedRegistration.organization_type)}</p>
                        <p><strong>Founded:</strong> {selectedRegistration.founded_year || 'N/A'}</p>
                        <p><strong>Employees:</strong> {selectedRegistration.employee_count || 'N/A'}</p>
                        <p><strong>Location:</strong> {selectedRegistration.headquarters}, {selectedRegistration.country}</p>
                        {selectedRegistration.website && (
                          <p><strong>Website:</strong> <a href={selectedRegistration.website} target="_blank" rel="noopener noreferrer" className="text-blue-600">{selectedRegistration.website}</a></p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {selectedRegistration.first_name} {selectedRegistration.last_name}</p>
                        <p><strong>Position:</strong> {selectedRegistration.position}</p>
                        <p><strong>Email:</strong> {selectedRegistration.email}</p>
                        {selectedRegistration.phone && <p><strong>Phone:</strong> {selectedRegistration.phone}</p>}
                        {selectedRegistration.linkedin_profile && (
                          <p><strong>LinkedIn:</strong> <a href={selectedRegistration.linkedin_profile} target="_blank" rel="noopener noreferrer" className="text-blue-600">Profile</a></p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-700">{selectedRegistration.description}</p>
                  </div>
                  
                  {selectedRegistration.sectors && selectedRegistration.sectors.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Sectors</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedRegistration.sectors.map((sector, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {sector}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedRegistration.key_achievements && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Achievements</h4>
                      <p className="text-sm text-gray-700">{selectedRegistration.key_achievements}</p>
                    </div>
                  )}
                </div>
                
                {selectedRegistration.status === 'pending' && (
                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                    <button
                      onClick={() => handleStatusChange(selectedRegistration.id, 'reject', { reason: 'Rejected by admin' })}
                      className="btn btn-secondary text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedRegistration.id, 'approve')}
                      className="btn btn-primary"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrganizationsPage;