import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Building2, MapPin, Calendar, DollarSign, Plus, Filter, ChevronDown, X, Check, Briefcase, Users, Tag } from 'lucide-react';
import { companyAPI, industryAPI } from '../services/api';
import '../styles/companies.css';

const CompaniesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCompanies, setTotalCompanies] = useState(0);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedCompanyTypes, setSelectedCompanyTypes] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedEmployeeRanges, setSelectedEmployeeRanges] = useState([]);
  const [selectedFundingStages, setSelectedFundingStages] = useState([]);
  const [loadingIndustries, setLoadingIndustries] = useState(false);
  
  // View options states
  const [viewMode, setViewMode] = useState('cards'); // 'table', 'cards', 'landscape'
  const [showStats, setShowStats] = useState(false);
  const [showColumnEditor, setShowColumnEditor] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Predefined filter options
  const companyTypes = [
    { id: 'Startup', name: 'Startup' },
    { id: 'SME', name: 'Small & Medium Enterprise' },
    { id: 'Corporation', name: 'Corporation' },
    { id: 'Non-profit', name: 'Non-profit' },
    { id: 'Government', name: 'Government' },
  ];
  
  const statusOptions = [
    { id: 'Operating', name: 'Operating' },
    { id: 'Stealth', name: 'Stealth Mode' },
    { id: 'Pre-launch', name: 'Pre-launch' },
    { id: 'Acquired', name: 'Acquired' },
    { id: 'Closed', name: 'Closed' },
  ];
  
  const employeeRanges = [
    { id: '1-10', name: '1-10 employees' },
    { id: '11-50', name: '11-50 employees' },
    { id: '51-200', name: '51-200 employees' },
    { id: '201-500', name: '201-500 employees' },
    { id: '501-1000', name: '501-1000 employees' },
    { id: '1001-5000', name: '1001-5000 employees' },
    { id: '5000+', name: '5000+ employees' },
  ];
  
  const fundingStages = [
    { id: 'Pre-seed', name: 'Pre-seed' },
    { id: 'Seed', name: 'Seed' },
    { id: 'Series A', name: 'Series A' },
    { id: 'Series B', name: 'Series B' },
    { id: 'Series C', name: 'Series C' },
    { id: 'Series D+', name: 'Series D+' },
    { id: 'Grant', name: 'Grant' },
    { id: 'Bootstrapped', name: 'Bootstrapped' },
  ];

  // Fetch industries for filter
  useEffect(() => {
    const fetchIndustries = async () => {
      setLoadingIndustries(true);
      try {
        const response = await industryAPI.getAll();
        const industryData = response.data || [];
        setIndustries(industryData.map(industry => ({
          id: industry.id,
          name: industry.name
        })));
      } catch (err) {
        console.error('Error fetching industries:', err);
      } finally {
        setLoadingIndustries(false);
      }
    };
    
    fetchIndustries();
  }, []);

  // Get search and filter parameters from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    
    // Get search term
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    // Get industry filters
    const industryParam = urlParams.get('industries');
    if (industryParam) {
      setSelectedIndustries(industryParam.split(','));
    }
    
    // Get company type filters
    const companyTypeParam = urlParams.get('company_type');
    if (companyTypeParam) {
      setSelectedCompanyTypes(companyTypeParam.split(','));
    }
    
    // Get status filters
    const statusParam = urlParams.get('status');
    if (statusParam) {
      setSelectedStatuses(statusParam.split(','));
    }
    
    // Get employee range filters
    const employeeRangeParam = urlParams.get('employee_count_range');
    if (employeeRangeParam) {
      setSelectedEmployeeRanges(employeeRangeParam.split(','));
    }
    
    // Get funding stage filters
    const fundingStageParam = urlParams.get('last_funding_stage');
    if (fundingStageParam) {
      setSelectedFundingStages(fundingStageParam.split(','));
    }
    
    // Fetch companies with all parameters
    fetchCompanies(1);
  }, [location.search]);

  const fetchCompanies = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page };
      
      // Add search term if present
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      // Add industry filters if selected
      if (selectedIndustries.length > 0) {
        params.industries = selectedIndustries.join(',');
      }
      
      // Add company type filters if selected
      if (selectedCompanyTypes.length > 0) {
        params.company_type = selectedCompanyTypes.join(',');
      }
      
      // Add status filters if selected
      if (selectedStatuses.length > 0) {
        params.status = selectedStatuses.join(',');
      }
      
      // Add employee range filters if selected
      if (selectedEmployeeRanges.length > 0) {
        params.employee_count_range = selectedEmployeeRanges.join(',');
      }
      
      // Add funding stage filters if selected
      if (selectedFundingStages.length > 0) {
        params.last_funding_stage = selectedFundingStages.join(',');
      }

      console.log('Fetching companies with params:', params);
      const response = await companyAPI.getAll(params);
      
      if (response.success) {
        setCompanies(response.data);
        // If the response has count property, use it for pagination
        if (response.data && response.data.count !== undefined) {
          setTotalCompanies(response.data.count);
          setTotalPages(Math.ceil(response.data.count / 20)); // Assuming PAGE_SIZE is 20 from backend
        } else {
          setTotalCompanies(response.data.length);
          setTotalPages(Math.ceil(response.data.length / 20));
        }
        setCurrentPage(page);
      } else {
        throw new Error(response.error || 'Failed to fetch companies');
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err.message || 'Failed to load companies');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters and update URL
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    
    if (selectedIndustries.length > 0) {
      params.set('industries', selectedIndustries.join(','));
    }
    
    if (selectedCompanyTypes.length > 0) {
      params.set('company_type', selectedCompanyTypes.join(','));
    }
    
    if (selectedStatuses.length > 0) {
      params.set('status', selectedStatuses.join(','));
    }
    
    if (selectedEmployeeRanges.length > 0) {
      params.set('employee_count_range', selectedEmployeeRanges.join(','));
    }
    
    if (selectedFundingStages.length > 0) {
      params.set('last_funding_stage', selectedFundingStages.join(','));
    }
    
    navigate(`/companies?${params.toString()}`);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedIndustries([]);
    setSelectedCompanyTypes([]);
    setSelectedStatuses([]);
    setSelectedEmployeeRanges([]);
    setSelectedFundingStages([]);
    navigate('/companies');
  };
  
  // Toggle selection of a filter item
  const toggleFilter = (id, selectedArray, setSelectedArray) => {
    if (selectedArray.includes(id)) {
      setSelectedArray(selectedArray.filter(item => item !== id));
    } else {
      setSelectedArray([...selectedArray, id]);
    }
  };

  // Handle search submission (e.g., on enter or button click)
  const handleSearch = () => {
    fetchCompanies(1, searchTerm);
  };
  
  // Debounced search can also be implemented here
  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     if (searchTerm !== undefined) fetchCompanies(1, searchTerm);
  //   }, 500);
  //   return () => clearTimeout(delayDebounceFn);
  // }, [searchTerm]);


  const getStatusColor = (status) => {
    switch (status) {
      case 'Operating': return 'bg-green-100 text-green-800';
      case 'Acquired': return 'bg-blue-100 text-blue-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      case 'IPO': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Server-side filtering is now primary, client-side can be a fallback or removed
  // const filteredCompanies = companies.filter(company =>
  //   company.name && company.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filteredCompanies = companies; // Data is already filtered by backend via API params

  if (loading && companies.length === 0) { // Show full page loader only on initial load
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <svg className="animate-spin h-16 w-16 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Companies</h3>
            <p className="text-gray-600">Please wait while we fetch the data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto companies-container custom-scrollbar">
      {/* Header - Modern Style with Gradient */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm filter-section">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Companies</span>
              <div className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full animate-pulse">
                Live Data
              </div>
            </h1>
            <div className="flex items-center">
              <p className="text-gray-600 mr-2 text-sm md:text-base">
                Discover <span className="font-semibold text-indigo-700">{totalCompanies}</span> companies in Ethiopia's startup ecosystem
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm">
                Ethiopia
              </span>
            </div>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link 
              to="/companies/add" 
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus size={18} className="mr-2" />
              Add Company
            </Link>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 flex items-center shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar - Modern Style with Glass Effect */}
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl mb-8 overflow-hidden shadow-md">
        <div className="p-5 md:p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-grow max-w-xl group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 group-hover:text-indigo-600 transition-colors duration-300" size={20} />
                <input
                  type="text"
                  placeholder="Search companies by name, description..."
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-300 hover:shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
            </div>
            <button 
              onClick={applyFilters} 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-5 py-3.5 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Search
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`flex items-center px-5 py-3.5 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${
                showFilters 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter size={18} className="mr-2" />
              Filters {(selectedIndustries.length + selectedCompanyTypes.length + selectedStatuses.length + selectedEmployeeRanges.length + selectedFundingStages.length) > 0 && 
                <span className="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold">
                  {selectedIndustries.length + selectedCompanyTypes.length + selectedStatuses.length + selectedEmployeeRanges.length + selectedFundingStages.length}
                </span>
              }
              <ChevronDown size={18} className={`ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {(selectedIndustries.length + selectedCompanyTypes.length + selectedStatuses.length + selectedEmployeeRanges.length + selectedFundingStages.length) > 0 && (
              <button 
                onClick={resetFilters} 
                className="flex items-center px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 border border-red-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <X size={16} className="mr-1.5" />
                <span className="font-medium">Clear All</span>
              </button>
            )}
          </div>
          
          {/* Filter Panel - Modern Style with Animations */}
          {showFilters && (
            <div className="mt-6 border-t border-gray-200 pt-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {/* Industries Filter */}
                <div className="space-y-3 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Tag size={16} className="text-blue-600" />
                    </div>
                    <span className="text-blue-800">Industries</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-50 pointer-events-none z-10 h-60" style={{ display: 'none' }}></div>
                    <div className="max-h-60 overflow-y-auto space-y-1 pl-1 pr-2 custom-scrollbar">
                      {loadingIndustries ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="relative w-10 h-10">
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-ping opacity-75"></div>
                            <div className="relative w-10 h-10 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                          </div>
                        </div>
                      ) : (
                        industries.map(industry => (
                          <div 
                            key={industry.id} 
                            className="flex items-center gap-2 cursor-pointer hover:bg-blue-100/70 p-2.5 rounded-lg transition-all duration-200 transform hover:translate-x-1"
                            onClick={() => toggleFilter(industry.id.toString(), selectedIndustries, setSelectedIndustries)}
                          >
                            <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-300 ${
                              selectedIndustries.includes(industry.id.toString()) 
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 border-transparent scale-110' 
                                : 'border-blue-300 bg-white'
                            }`}>
                              {selectedIndustries.includes(industry.id.toString()) && 
                                <Check size={14} className="text-white" />
                              }
                            </div>
                            <span className={`text-sm transition-colors duration-300 ${
                              selectedIndustries.includes(industry.id.toString())
                                ? 'text-blue-800 font-medium'
                                : 'text-gray-700'
                            }`}>{industry.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Company Type Filter */}
                <div className="space-y-3 bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <Briefcase size={16} className="text-purple-600" />
                    </div>
                    <span className="text-purple-800">Company Type</span>
                  </div>
                  <div className="space-y-1 pl-1">
                    {companyTypes.map(type => (
                      <div 
                        key={type.id} 
                        className="flex items-center gap-2 cursor-pointer hover:bg-purple-100/70 p-2.5 rounded-lg transition-all duration-200 transform hover:translate-x-1"
                        onClick={() => toggleFilter(type.id, selectedCompanyTypes, setSelectedCompanyTypes)}
                      >
                        <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-300 ${
                          selectedCompanyTypes.includes(type.id) 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent scale-110' 
                            : 'border-purple-300 bg-white'
                        }`}>
                          {selectedCompanyTypes.includes(type.id) && <Check size={14} className="text-white" />}
                        </div>
                        <span className={`text-sm transition-colors duration-300 ${
                          selectedCompanyTypes.includes(type.id)
                            ? 'text-purple-800 font-medium'
                            : 'text-gray-700'
                        }`}>{type.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Status Filter */}
                <div className="space-y-3 bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <Building2 size={16} className="text-green-600" />
                    </div>
                    <span className="text-green-800">Status</span>
                  </div>
                  <div className="space-y-1 pl-1">
                    {statusOptions.map(status => (
                      <div 
                        key={status.id} 
                        className="flex items-center gap-2 cursor-pointer hover:bg-green-100/70 p-2.5 rounded-lg transition-all duration-200 transform hover:translate-x-1"
                        onClick={() => toggleFilter(status.id, selectedStatuses, setSelectedStatuses)}
                      >
                        <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-300 ${
                          selectedStatuses.includes(status.id) 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-transparent scale-110' 
                            : 'border-green-300 bg-white'
                        }`}>
                          {selectedStatuses.includes(status.id) && <Check size={14} className="text-white" />}
                        </div>
                        <span className={`text-sm transition-colors duration-300 ${
                          selectedStatuses.includes(status.id)
                            ? 'text-green-800 font-medium'
                            : 'text-gray-700'
                        }`}>{status.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Employee Range Filter */}
                <div className="space-y-3 bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <div className="p-1.5 bg-amber-100 rounded-lg">
                      <Users size={16} className="text-amber-600" />
                    </div>
                    <span className="text-amber-800">Team Size</span>
                  </div>
                  <div className="space-y-1 pl-1">
                    {employeeRanges.map(range => (
                      <div 
                        key={range.id} 
                        className="flex items-center gap-2 cursor-pointer hover:bg-amber-100/70 p-2.5 rounded-lg transition-all duration-200 transform hover:translate-x-1"
                        onClick={() => toggleFilter(range.id, selectedEmployeeRanges, setSelectedEmployeeRanges)}
                      >
                        <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-300 ${
                          selectedEmployeeRanges.includes(range.id) 
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 border-transparent scale-110' 
                            : 'border-amber-300 bg-white'
                        }`}>
                          {selectedEmployeeRanges.includes(range.id) && <Check size={14} className="text-white" />}
                        </div>
                        <span className={`text-sm transition-colors duration-300 ${
                          selectedEmployeeRanges.includes(range.id)
                            ? 'text-amber-800 font-medium'
                            : 'text-gray-700'
                        }`}>{range.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Funding Stage Filter */}
                <div className="space-y-3 bg-gradient-to-br from-rose-50 to-red-50 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <div className="p-1.5 bg-rose-100 rounded-lg">
                      <DollarSign size={16} className="text-rose-600" />
                    </div>
                    <span className="text-rose-800">Funding Stage</span>
                  </div>
                  <div className="space-y-1 pl-1">
                    {fundingStages.map(stage => (
                      <div 
                        key={stage.id} 
                        className="flex items-center gap-2 cursor-pointer hover:bg-rose-100/70 p-2.5 rounded-lg transition-all duration-200 transform hover:translate-x-1"
                        onClick={() => toggleFilter(stage.id, selectedFundingStages, setSelectedFundingStages)}
                      >
                        <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-300 ${
                          selectedFundingStages.includes(stage.id) 
                            ? 'bg-gradient-to-r from-rose-500 to-red-500 border-transparent scale-110' 
                            : 'border-rose-300 bg-white'
                        }`}>
                          {selectedFundingStages.includes(stage.id) && <Check size={14} className="text-white" />}
                        </div>
                        <span className={`text-sm transition-colors duration-300 ${
                          selectedFundingStages.includes(stage.id)
                            ? 'text-rose-800 font-medium'
                            : 'text-gray-700'
                        }`}>{stage.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button 
                  onClick={resetFilters}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Reset All
                </button>
                <button 
                  onClick={applyFilters}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Active Filters Display - Modern Style with Animations */}
      {(selectedIndustries.length + selectedCompanyTypes.length + selectedStatuses.length + selectedEmployeeRanges.length + selectedFundingStages.length) > 0 && (
        <div className="mb-6 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-5 shadow-md animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">Active filters:</span>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-full">
                {selectedIndustries.length + selectedCompanyTypes.length + selectedStatuses.length + selectedEmployeeRanges.length + selectedFundingStages.length}
              </span>
            </div>
            <button 
              onClick={resetFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline flex items-center transition-colors duration-300"
            >
              <X size={14} className="mr-1" />
              Clear all filters
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedIndustries.map(id => {
              const industry = industries.find(i => i.id.toString() === id);
              return industry ? (
                <div key={id} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1 shadow-sm filter-badge animate-fadeIn">
                  <Tag size={12} className="mr-1" />
                  {industry.name}
                  <button 
                    onClick={() => toggleFilter(id, selectedIndustries, setSelectedIndustries)}
                    className="ml-1 bg-blue-400/30 hover:bg-blue-400/50 rounded-full p-0.5 transition-colors duration-300"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : null;
            })}
            
            {selectedCompanyTypes.map(id => (
              <div key={id} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                <Briefcase size={12} className="mr-1" />
                {companyTypes.find(t => t.id === id)?.name}
                <button 
                  onClick={() => toggleFilter(id, selectedCompanyTypes, setSelectedCompanyTypes)}
                  className="ml-1 bg-purple-400/30 hover:bg-purple-400/50 rounded-full p-0.5 transition-colors duration-300"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {selectedStatuses.map(id => (
              <div key={id} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                <Building2 size={12} className="mr-1" />
                {statusOptions.find(s => s.id === id)?.name}
                <button 
                  onClick={() => toggleFilter(id, selectedStatuses, setSelectedStatuses)}
                  className="ml-1 bg-green-400/30 hover:bg-green-400/50 rounded-full p-0.5 transition-colors duration-300"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {selectedEmployeeRanges.map(id => (
              <div key={id} className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                <Users size={12} className="mr-1" />
                {employeeRanges.find(r => r.id === id)?.name}
                <button 
                  onClick={() => toggleFilter(id, selectedEmployeeRanges, setSelectedEmployeeRanges)}
                  className="ml-1 bg-amber-400/30 hover:bg-amber-400/50 rounded-full p-0.5 transition-colors duration-300"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {selectedFundingStages.map(id => (
              <div key={id} className="bg-gradient-to-r from-rose-500 to-red-500 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                <DollarSign size={12} className="mr-1" />
                {fundingStages.find(s => s.id === id)?.name}
                <button 
                  onClick={() => toggleFilter(id, selectedFundingStages, setSelectedFundingStages)}
                  className="ml-1 bg-rose-400/30 hover:bg-rose-400/50 rounded-full p-0.5 transition-colors duration-300"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State - Modern Style with Animations */}
      {error && !loading && ( // Show error only if not loading
        <div className="bg-white/90 backdrop-blur-sm border border-red-200 rounded-xl p-8 mb-8 shadow-md animate-fadeIn">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-rose-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <div className="relative">
                <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-ping opacity-75"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Companies</h3>
            <p className="text-red-600 mb-6 max-w-md mx-auto">{String(error)}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                Clear Filters
              </button>
              <button
                onClick={() => fetchCompanies(1)} // Retry fetching
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-medium hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator - Modern Style with Animations */}
      {loading && (
        <div className="text-center py-8 animate-fadeIn">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl text-indigo-700 shadow-md">
            <div className="relative mr-3">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-8 h-8 border-4 border-indigo-200 rounded-full animate-ping opacity-30"></div>
            </div>
            <span className="font-medium">Loading companies...</span>
          </div>
        </div>
      )}

      {/* View Options and Actions - Exact Dealroom Style */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Showing {totalCompanies} companies</span>
          
          {/* Advanced Filters Button */}
          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`text-xs hover:underline mr-4 ${showAdvancedFilters ? 'text-blue-800 font-medium' : 'text-blue-600'}`}
          >
            Advanced filters
          </button>
          
          {/* Save & Export Button */}
          <button 
            onClick={() => {
              // In a real app, this would open a modal or dropdown with export options
              alert('Export functionality would be implemented here');
            }}
            className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Save & export
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Show Stats Toggle */}
          <div className="flex items-center mr-2">
            <input 
              type="checkbox" 
              id="showStats" 
              checked={showStats}
              onChange={() => setShowStats(!showStats)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="showStats" className="ml-1 text-sm text-gray-700">
              Show stats
            </label>
          </div>
          
          {/* Edit Columns Button */}
          <button 
            onClick={() => setShowColumnEditor(!showColumnEditor)}
            className="text-sm text-gray-700 hover:text-blue-600 mr-3 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit columns
          </button>
          
          {/* View Toggle */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button 
              type="button" 
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-medium rounded-l-md focus:z-10 focus:ring-1 focus:ring-blue-500 view-toggle-button tooltip ${
                viewMode === 'table' 
                  ? 'active' 
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
              data-tooltip="Table View"
            >
              Table
            </button>
            <button 
              type="button" 
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 text-xs font-medium border focus:z-10 focus:ring-1 focus:ring-blue-500 view-toggle-button tooltip ${
                viewMode === 'cards' 
                  ? 'active' 
                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
              }`}
              data-tooltip="Card View"
            >
              Cards
            </button>
            <button 
              type="button" 
              onClick={() => setViewMode('landscape')}
              className={`px-3 py-1.5 text-xs font-medium rounded-r-md focus:z-10 focus:ring-1 focus:ring-blue-500 view-toggle-button tooltip ${
                viewMode === 'landscape' 
                  ? 'active' 
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
              data-tooltip="Landscape View"
            >
              Landscape
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-3">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="From" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input 
                  type="number" 
                  placeholder="To" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Funding Date</label>
              <div className="flex gap-2">
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Funding</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Min $" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input 
                  type="number" 
                  placeholder="Max $" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
              Apply Advanced Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Column Editor */}
      {showColumnEditor && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-3">Edit Columns</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Name', 'Description', 'Location', 'Founded', 'Status', 'Industries', 'Team Size', 'Funding', 'Last Round', 'Valuation', 'Revenue', 'Website'].map(column => (
              <div key={column} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`column-${column}`} 
                  defaultChecked={['Name', 'Description', 'Location', 'Founded', 'Industries'].includes(column)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor={`column-${column}`} className="ml-2 text-sm text-gray-700">
                  {column}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
              Apply Column Settings
            </button>
          </div>
        </div>
      )}

      {/* Companies Display - Multiple View Modes */}
      {!loading && filteredCompanies.length > 0 ? (
        <>
          {/* Table View - Exact Dealroom Style */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    {/* Company Name Column */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    
                    {/* Dealroom Signal Column */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Dealroom signal
                        <button className="ml-1 text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    
                    {/* Market/Industry Column */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Market
                        <button className="ml-1 text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    
                    {/* Company Type Column */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Type
                        <button className="ml-1 text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    
                    {/* Growth Column */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Growth
                        <button className="ml-1 text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    
                    {/* Launch Date Column */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Launch date
                        <button className="ml-1 text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    
                    {/* Valuation Column */}
                    {showStats && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          Valuation
                          <button className="ml-1 text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                          </button>
                        </div>
                      </th>
                    )}
                    
                    {/* Funding Column */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Funding
                        <button className="ml-1 text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    
                    {/* Location Column */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Location
                        <button className="ml-1 text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    
                    {/* Last Round Column */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Last Round
                        <button className="ml-1 text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    
                    {/* Web Visits Column - Only shown when showStats is true */}
                    {showStats && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          Monthly web visits
                          <button className="ml-1 text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                          </button>
                        </div>
                      </th>
                    )}
                    
                    {/* Status Column - Only shown when showStats is true */}
                    {showStats && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCompanies.map((company) => (
                    <tr key={company.id || company.slug || Math.random()} className="hover:bg-gray-50">
                      {/* Company Name Cell */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                            {company.logo ? (
                              <img src={company.logo} alt={`${company.name} logo`} className="h-8 w-8 object-contain" />
                            ) : (
                              <Building2 className="text-gray-400" size={20} />
                            )}
                          </div>
                          <div className="ml-3">
                            <Link to={`/companies/${company.slug}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                              {company.name || 'Unknown Company'}
                            </Link>
                            <div className="text-xs text-gray-500 mt-1">
                              <button className="text-blue-600 hover:underline">Save to list</button>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Dealroom Signal Cell */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {Math.floor(Math.random() * 30) + 70} {/* Random score between 70-99 */}
                        </div>
                      </td>
                      
                      {/* Market/Industry Cell */}
                      <td className="px-4 py-4">
                        {company.industries && Array.isArray(company.industries) && company.industries.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {company.industries.slice(0, 2).map((industry, index) => (
                              <span
                                key={industry.id || index}
                                className="text-xs text-blue-600 hover:underline cursor-pointer"
                              >
                                {industry.name || 'Unknown Industry'}
                              </span>
                            ))}
                            {company.industries.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{company.industries.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      
                      {/* Company Type Cell */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-xs text-blue-600 hover:underline cursor-pointer">
                          {company.company_type || 'B2B'}
                        </span>
                      </td>
                      
                      {/* Growth Cell */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {Math.floor(Math.random() * 200) + 10}% {/* Random growth between 10-210% */}
                        </div>
                        <div className="text-xs text-gray-500">
                          {company.employee_count || '11-50'} employees
                        </div>
                      </td>
                      
                      {/* Launch Date Cell */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {company.founded_date 
                          ? new Date(company.founded_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                          : company.founded_year || '2020'}
                      </td>
                      
                      {/* Valuation Cell - Only shown when showStats is true */}
                      {showStats && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {company.valuation_display || '$8—12m'}
                        </td>
                      )}
                      
                      {/* Funding Cell */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {company.total_funding_display || '$2.5m'}
                      </td>
                      
                      {/* Location Cell */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {[company.hq_city, company.hq_country].filter(Boolean).join(', ') || 'Addis Ababa, Ethiopia'}
                      </td>
                      
                      {/* Last Round Cell */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {company.last_funding_amount || '$2.0m'} {company.last_funding_type || 'SEED'}
                        </div>
                      </td>
                      
                      {/* Web Visits Cell - Only shown when showStats is true */}
                      {showStats && (
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {company.web_visits || '15k'}
                          </div>
                          {company.web_visits_growth && (
                            <div className="text-xs text-green-600">
                              +{company.web_visits_growth}%
                            </div>
                          )}
                        </td>
                      )}
                      
                      {/* Status Cell - Only shown when showStats is true */}
                      {showStats && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {company.status || 'operational'}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Cards View - Dealroom Style */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company, index) => (
                <div 
                  key={company.id || company.slug || Math.random()} 
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden company-card animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-[74px] h-[74px] bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200 company-logo-container">
                        {company.logo ? (
                          <img src={company.logo} alt={`${company.name} logo`} className="w-full h-full object-contain p-1" />
                        ) : (
                          <Building2 className="text-gray-400" size={28} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-900 text-base mb-1">
                              <Link to={`/companies/${company.slug}`} className="hover:text-blue-600 interactive-link">
                                {company.name || 'Unknown Company'}
                              </Link>
                            </h5>
                            {company.status && (
                              <div className="text-xs text-gray-500 italic">
                                {company.status}
                              </div>
                            )}
                          </div>
                          <div className="text-lg font-semibold text-gray-900 signal-score">
                            {Math.floor(Math.random() * 30) + 70}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 mt-1">
                          <button className="text-blue-600 hover:underline">Save to list</button>
                        </div>
                      </div>
                    </div>

                    {company.short_description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                        {company.short_description}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        {/* Client Focus */}
                        <div className="mb-2">
                          <span className="text-xs text-blue-600 hover:underline cursor-pointer block">
                            {company.company_type || 'B2B'}
                          </span>
                        </div>
                        
                        {/* Industries */}
                        {company.industries && Array.isArray(company.industries) && company.industries.length > 0 && (
                          <div className="flex flex-col gap-1">
                            {company.industries.map((industry, index) => (
                              <span
                                key={industry.id || index}
                                className="text-xs text-blue-600 hover:underline cursor-pointer"
                              >
                                {industry.name || 'Unknown Industry'}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        {/* Technologies */}
                        <div className="mb-2">
                          <span className="text-xs text-blue-600 hover:underline cursor-pointer block">
                            {company.technology || 'mobile app'}
                          </span>
                        </div>
                        
                        {/* Business Model */}
                        <div>
                          <span className="text-xs text-blue-600 hover:underline cursor-pointer block">
                            {company.business_model || 'marketplace & ecommerce'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        {/* Growth */}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {Math.floor(Math.random() * 200) + 10}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {company.employee_count || '11-50'} employees
                          </div>
                        </div>
                        
                        {/* Founded Date */}
                        <div className="text-sm text-gray-500">
                          {company.founded_date 
                            ? new Date(company.founded_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                            : company.founded_year || 'Jul 2020'}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {/* Funding */}
                        <div className="text-sm text-gray-500">
                          {company.total_funding_display || '$2.5m'}
                        </div>
                        
                        {/* Location */}
                        <div className="text-sm text-gray-500">
                          {[company.hq_city, company.hq_country].filter(Boolean).join(', ') || 'Addis Ababa, Ethiopia'}
                        </div>
                        
                        {/* Last Round */}
                        <div className="text-sm text-gray-900">
                          {company.last_funding_amount || '$2.0m'} {company.last_funding_type || 'SEED'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Landscape View - Dealroom Style */}
          {viewMode === 'landscape' && (
            <div className="space-y-4">
              {filteredCompanies.map((company, index) => (
                <div 
                  key={company.id || company.slug || Math.random()} 
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden company-landscape animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Company Logo and Name Section */}
                      <div className="flex flex-col items-start gap-3 md:w-1/4">
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                          {company.logo ? (
                            <img src={company.logo} alt={`${company.name} logo`} className="w-full h-full object-contain" />
                          ) : (
                            <Building2 className="text-gray-400" size={32} />
                          )}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 text-base">
                            <Link to={`/companies/${company.slug}`} className="hover:text-blue-600">
                              {company.name || 'Unknown Company'}
                            </Link>
                          </h5>
                          <div className="text-xs text-gray-500 mt-1">
                            <button className="text-blue-600 hover:underline">Save to list</button>
                          </div>
                          
                          {/* Company Description */}
                          {company.short_description && (
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2 max-w-xs">
                              {company.short_description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Company Details Section */}
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* First Column - Client Focus & Industries */}
                        <div className="space-y-3">
                          {/* Client Focus */}
                          <div>
                            <span className="text-xs text-blue-600 hover:underline cursor-pointer block">
                              {company.company_type || 'B2B'}
                            </span>
                          </div>
                          
                          {/* Industries */}
                          <div>
                            {company.industries && Array.isArray(company.industries) && company.industries.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {company.industries.map((industry, index) => (
                                  <span
                                    key={industry.id || index}
                                    className="text-xs text-blue-600 hover:underline cursor-pointer"
                                  >
                                    {industry.name || 'Unknown Industry'}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Second Column - Technologies & Business Model */}
                        <div className="space-y-3">
                          {/* Technologies */}
                          <div>
                            <span className="text-xs text-blue-600 hover:underline cursor-pointer block">
                              {company.technology || 'mobile app'}
                            </span>
                          </div>
                          
                          {/* Business Model */}
                          <div>
                            <span className="text-xs text-blue-600 hover:underline cursor-pointer block">
                              {company.business_model || 'marketplace & ecommerce'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Third Column - Metrics */}
                        <div className="space-y-3">
                          {/* Growth */}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {Math.floor(Math.random() * 200) + 10}%
                            </div>
                            <div className="text-xs text-gray-500">
                              {company.employee_count || '11-50'} employees
                            </div>
                          </div>
                          
                          {/* Founded Date */}
                          <div className="text-sm text-gray-500">
                            {company.founded_date 
                              ? new Date(company.founded_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                              : company.founded_year || 'Jul 2020'}
                          </div>
                          
                          {/* Valuation */}
                          {showStats && (
                            <div className="text-sm text-gray-500">
                              {company.valuation_display || '$8—12m'}
                            </div>
                          )}
                          
                          {/* Funding */}
                          <div className="text-sm text-gray-500">
                            {company.total_funding_display || '$2.5m'}
                          </div>
                          
                          {/* Location */}
                          <div className="text-sm text-gray-500">
                            {[company.hq_city, company.hq_country].filter(Boolean).join(', ') || 'Addis Ababa, Ethiopia'}
                          </div>
                          
                          {/* Last Round */}
                          <div className="text-sm text-gray-900">
                            {company.last_funding_amount || '$2.0m'} {company.last_funding_type || 'SEED'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Dealroom Signal Section */}
                      <div className="md:w-16 flex flex-col items-center justify-start">
                        <div className="text-lg font-semibold text-gray-900 signal-score">
                          {Math.floor(Math.random() * 30) + 70}
                        </div>
                        
                        {/* Web Visits - Only shown when showStats is true */}
                        {showStats && (
                          <div className="mt-4 text-center">
                            <div className="text-sm text-gray-900">
                              {company.web_visits || '15k'}
                            </div>
                            {company.web_visits_growth && (
                              <div className="text-xs text-green-600">
                                +{company.web_visits_growth}%
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Status - Only shown when showStats is true */}
                        {showStats && (
                          <div className="mt-4 text-xs text-gray-500">
                            {company.status || 'operational'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        
          {/* Pagination - Dealroom Style */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center">
              <nav className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    const params = new URLSearchParams(location.search);
                    params.set('page', currentPage - 1);
                    navigate(`/companies?${params.toString()}`);
                  }}
                  disabled={currentPage === 1 || loading}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed pagination-button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        const params = new URLSearchParams(location.search);
                        params.set('page', pageNum);
                        navigate(`/companies?${params.toString()}`);
                      }}
                      className={`px-4 py-2 rounded-md text-sm font-medium pagination-button ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white active'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => {
                    const params = new URLSearchParams(location.search);
                    params.set('page', currentPage + 1);
                    navigate(`/companies?${params.toString()}`);
                  }}
                  disabled={currentPage === totalPages || loading}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        !loading && ( // Ensure this only shows when not loading and no companies
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No companies found' : 'No companies available'}
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
              {searchTerm
                ? `No companies match "${searchTerm}". Try a different search term or adjust your filters.`
                : 'Be the first to add a company to the Ethiopian startup ecosystem.'
              }
            </p>
            <div className="flex justify-center gap-3">
              {searchTerm && (
                <button 
                  onClick={resetFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center"
                >
                  <X size={14} className="mr-1.5" />
                  Clear Filters
                </button>
              )}
              <Link 
                to="/companies/add" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus size={14} className="mr-1.5" />
                Add Company
              </Link>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CompaniesPage;