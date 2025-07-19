import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyAPI, industryAPI } from '../services/api';

const AddCompanyPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [industriesLoading, setIndustriesLoading] = useState(true);
  const [pageContent, setPageContent] = useState({
    title: 'Register Your Company',
    description: 'Join our startup ecosystem and get discovered by investors, partners, and customers.',
    benefits: [
      'Increase your visibility to potential investors',
      'Connect with other startups and partners',
      'Access to ecosystem insights and reports',
      'Networking opportunities with industry leaders'
    ],
    requirements: [
      'Company must be legally registered',
      'Provide accurate and up-to-date information',
      'Company should be actively operating or in development',
      'All information will be verified before approval'
    ]
  });

  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    description: '',
    website: '',
    founded_date: '',
    company_type: '',
    status: 'Operating',
    hq_country: '',
    hq_city: '',
    hq_address: '',
    employee_count_range: '', // changed from employee_count
    total_funding_raised_usd: '',
    contact_email: '',
    contact_phone: '',
    linkedin_url: '',
    twitter_url: '',
    facebook_url: '',
    logo: '', // changed from logo_url
    industries: [],
    tags: '',
    notes: ''
  });

  const [industries, setIndustries] = useState([]);
  const [step, setStep] = useState(1); // 1: info, 2: form

  useEffect(() => {
    loadIndustries();
  }, []);

  const loadIndustries = async () => {
    try {
      setIndustriesLoading(true);
      const response = await industryAPI.getAll();
      console.log('Industries response:', response);
      
      // Handle the wrapped response from industryAPI
      if (response && response.success && response.data) {
        setIndustries(Array.isArray(response.data) ? response.data : []);
      } else if (response && Array.isArray(response)) {
        // Fallback for direct array response
        setIndustries(response);
      } else {
        console.log('Industries API returned unexpected format:', response);
        setIndustries([]);
      }
    } catch (err) {
      console.error('Failed to load industries:', err);
      setIndustries([]);
      // Don't block the form if industries fail to load
    } finally {
      setIndustriesLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'industries') {
      let updated = [...formData.industries];
      if (checked) {
        updated.push(Number(value));
      } else {
        updated = updated.filter((id) => id !== Number(value));
      }
      setFormData({ ...formData, industries: updated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const submissionData = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags') {
          const tagsStr = value
            .split(',')
            .map(t => t.trim())
            .filter(Boolean)
            .join(', ');
          if (tagsStr) submissionData['tags'] = tagsStr;
        } else if (key === 'industries') {
          if (Array.isArray(value) && value.length > 0) submissionData['industry_ids'] = value;
        } else if (key === 'employee_count_range') {
          if (value) submissionData['employee_count_range'] = value;
        } else if (key === 'total_funding_raised_usd') {
          const num = Number(value);
          if (value !== '' && value !== null && value !== undefined && !isNaN(num)) {
            submissionData['total_funding_raised_usd'] = num;
          }
        } else if (key === 'logo') {
          if (value) submissionData['logo'] = value;
        } else if (
          key === 'name' ||
          key === 'short_description' ||
          key === 'hq_country' ||
          key === 'hq_city' ||
          key === 'contact_email'
        ) {
          submissionData[key] = value;
        } else if (
          (Array.isArray(value) && value.length > 0) ||
          (!Array.isArray(value) && value !== '' && value !== null && value !== undefined)
        ) {
          submissionData[key] = value;
        }
      });
      
      if (!submissionData.status) submissionData.status = 'Operating';
      submissionData.submission_type = 'company_registration';
      
      console.log('Submitting data:', submissionData);
      const response = await companyAPI.create(submissionData);
      
      if (response && response.id) {
        setSubmitted(true);
        setTimeout(() => navigate('/companies'), 2000);
      } else if (response && typeof response === 'object') {
        if (response.errors) {
          setError(
            Object.entries(response.errors)
              .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
              .join(' | ')
          );
        } else if (response.detail) {
          setError(response.detail);
        } else {
          setError('Failed to create company. Please check your input.');
        }
      } else {
        setError('Failed to create company. Please check your input.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      if (err && typeof err === 'object' && err.errors) {
        setError(
          Object.entries(err.errors)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
            .join(' | ')
        );
      } else if (err && typeof err === 'object' && err.detail) {
        setError(err.detail);
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Debug: Add console log to see current step
  console.log('Current step:', step, 'Industries loading:', industriesLoading, 'Industries count:', industries.length);

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center relative overflow-hidden">
          {/* Confetti effect */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* You can replace this with a confetti library for real animation */}
            <svg width="100%" height="100%" className="absolute inset-0 animate-pulse opacity-30">
              <circle cx="20%" cy="20%" r="6" fill="#60a5fa" />
              <circle cx="80%" cy="30%" r="5" fill="#34d399" />
              <circle cx="50%" cy="80%" r="7" fill="#fbbf24" />
              <circle cx="70%" cy="60%" r="4" fill="#f472b6" />
              <circle cx="30%" cy="70%" r="5" fill="#a78bfa" />
            </svg>
          </div>
          {/* Animated checkmark */}
          <div className="flex justify-center mb-6 z-10 relative">
            <svg className="w-20 h-20 text-green-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#ecfdf5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 12l3 3 5-5" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 z-10 relative">Thank you for registering your company!</h2>
          <p className="text-lg text-gray-600 mb-6 z-10 relative">Your submission has been received and will be reviewed by our team. We appreciate your contribution to the ecosystem.</p>
          <button
            onClick={() => navigate('/companies')}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-lg text-lg font-semibold shadow-md hover:from-blue-600 hover:to-green-500 transition z-10 relative"
          >
            Go to Companies
          </button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {pageContent.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {pageContent.description}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Why Join Our Ecosystem?
              </h3>
              <ul className="space-y-3">
                {pageContent.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Requirements
              </h3>
              <ul className="space-y-3">
                {pageContent.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <button
              onClick={() => navigate('/companies')}
              className="px-6 py-3 bg-gray-600 text-white rounded-md text-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Back to Companies
            </button>
            <div className="space-x-4">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Continue to Form
              </button>
              {/* Add a direct link to skip intro */}
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-green-600 text-white rounded-md text-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Skip Intro
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2 - Registration Form
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Company Registration Form
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please fill out the form below to register your company
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm text-gray-600">Introduction</span>
            </div>
            <div className="w-16 h-1 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm text-gray-600">Registration Form</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm p-6 mx-auto max-w-4xl">
          {/* Back button */}
          <div className="mb-6">
            <button
              onClick={() => setStep(1)}
              className="flex items-center text-blue-600 hover:text-blue-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Introduction
            </button>
          </div>

          {/* Loading state for industries */}
          {industriesLoading && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm text-blue-700">Loading form data...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://www.example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Founded Date
                  </label>
                  <input
                    type="date"
                    name="founded_date"
                    value={formData.founded_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Type
                  </label>
                  <select
                    name="company_type"
                    value={formData.company_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="Startup">Startup</option>
                    <option value="SME">Small & Medium Enterprise</option>
                    <option value="Corporation">Corporation</option>
                    <option value="Non-profit">Non-profit</option>
                    <option value="Government">Government</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Operating">Operating</option>
                    <option value="Stealth">Stealth Mode</option>
                    <option value="Pre-launch">Pre-launch</option>
                    <option value="Acquired">Acquired</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Count
                  </label>
                  <select
                    name="employee_count_range"
                    value={formData.employee_count_range}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select range</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1001-5000">1001-5000 employees</option>
                    <option value="5000+">5000+ employees</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <input
                  type="text"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  required
                  maxLength="200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of your company (max 200 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.short_description.length}/200 characters
                </p>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed description of your company, products, and services"
                />
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="hq_country"
                    value={formData.hq_country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="hq_city"
                    value={formData.hq_city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter city"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="hq_address"
                  value={formData.hq_address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Full address (optional)"
                />
              </div>
            </div>

            {/* Industries */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Industries
              </h3>
              {Array.isArray(industries) && industries.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {industries.map((industry) => (
                    <label key={industry.id} className="flex items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="industries"
                        value={industry.id}
                        checked={formData.industries.includes(industry.id)}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{industry.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">
                  {industriesLoading ? 'Loading industries...' : 'No industries available. You can still submit the form.'}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="contact@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Social Media & Links */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Social Media & Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitter_url"
                    value={formData.twitter_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://twitter.com/yourcompany"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebook_url"
                    value={formData.facebook_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://facebook.com/yourcompany"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            </div>

            {/* Funding Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Funding Information (Optional)
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Funding Raised (USD)
                </label>
                <input
                  type="text"
                  name="total_funding_raised_usd"
                  value={formData.total_funding_raised_usd}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                      handleInputChange(e);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the total amount of funding raised to date
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Additional Information
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="AI, SaaS, B2B, Mobile (comma separated)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add relevant tags separated by commas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional information you'd like to share"
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="/terms" className="text-blue-600 hover:text-blue-500 underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                    Privacy Policy
                  </a>
                  . I confirm that all information provided is accurate and that I have the authority to register this company.
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/companies')}
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyPage;