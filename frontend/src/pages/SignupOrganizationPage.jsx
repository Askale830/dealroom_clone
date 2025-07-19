import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { organizationRegistrationAPI } from '../services/api';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Globe, 
  MapPin, 
  Calendar,
  User,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  BookOpen,
  Building,
  Heart
} from 'lucide-react';
import '../styles/SignupOrganizationPage.css';
import { useAuth } from '../contexts/AuthContext';

const SignupOrganizationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  const [formData, setFormData] = useState({
    // Organization Details
    organizationType: '',
    organizationName: '',
    website: '',
    description: '',
    foundedYear: '',
    employeeCount: '',
    headquarters: '',
    country: 'Ethiopia',
    
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    linkedinProfile: '',
    
    // Additional Information
    sectors: [],
    fundingStage: '',
    totalFunding: '',
    keyAchievements: '',
    
    // Account
    agreeToTerms: false,
    subscribeNewsletter: true
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Fetch organization types from backend
  const [organizationTypes, setOrganizationTypes] = useState([]);
  const [orgTypesLoading, setOrgTypesLoading] = useState(true);
  const [orgTypesError, setOrgTypesError] = useState('');

  useEffect(() => {
    async function fetchOrganizationTypes() {
      setOrgTypesLoading(true);
      setOrgTypesError('');
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/organization-types/');
        if (!response.ok) throw new Error('Failed to fetch organization types');
        const data = await response.json();
        // Optionally map icon strings to lucide-react icons here if backend returns icon names
        setOrganizationTypes(data);
      } catch {
        setOrgTypesError('Could not load organization types. Please try again later.');
      } finally {
        setOrgTypesLoading(false);
      }
    }
    fetchOrganizationTypes();
  }, []);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSectorChange = (sector) => {
    setFormData(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector]
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.organizationType) newErrors.organizationType = 'Please select organization type';
      if (!formData.organizationName) newErrors.organizationName = 'Organization name is required';
      if (!formData.description) newErrors.description = 'Description is required';
      if (!formData.headquarters) newErrors.headquarters = 'Headquarters location is required';
    }

    if (step === 2) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.position) newErrors.position = 'Position is required';
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (step === 3) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    if (!validateStep(3)) {
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      // Helper function to convert empty strings to null
      const emptyToNull = (value) => {
        if (typeof value === 'string' && value.trim() === '') {
          return null;
        }
        return value;
      };

      // Prepare data for API submission
      const submissionData = {
        // Organization Details
        organization_type: formData.organizationType,
        organization_name: formData.organizationName,
        website: emptyToNull(formData.website),
        description: formData.description,
        founded_year: formData.foundedYear ? parseInt(formData.foundedYear) : null,
        employee_count: emptyToNull(formData.employeeCount),
        headquarters: formData.headquarters,
        country: formData.country,
        
        // Contact Information
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: emptyToNull(formData.phone),
        position: formData.position,
        linkedin_profile: emptyToNull(formData.linkedinProfile),
        
        // Additional Information
        sectors: formData.sectors || [],
        funding_stage: emptyToNull(formData.fundingStage),
        total_funding: formData.totalFunding ? parseFloat(formData.totalFunding) : null,
        key_achievements: emptyToNull(formData.keyAchievements),
        
        // Account & Preferences
        subscribe_newsletter: formData.subscribeNewsletter
      };

      console.log('Submitting organization data:', JSON.stringify(submissionData, null, 2));
      
      // Submit to API
      const response = await organizationRegistrationAPI.create(submissionData);
      
      if (response.success) {
        // Show success message on same page
        setSubmissionData({
          organizationName: formData.organizationName,
          organizationType: formData.organizationType,
          organizationId: response.organization_id,
          companyId: response.company_id,
          message: response.message
        });
        setIsSubmitted(true);
      } else {
        // Handle API errors
        if (response.errors) {
          setErrors(response.errors);
        } else {
          setErrors({ general: response.message || 'Failed to submit organization registration.' });
        }
      }
      
    } catch (error) {
      console.error('Organization registration error:', JSON.stringify(error, null, 2));
      
      // Handle different types of errors
      if (error && typeof error === 'object') {
        // Check if it's a validation error response
        if (error.errors) {
          // Handle field-specific validation errors from the API
          const fieldErrors = {};
          
          // Map API field names to form field names
          Object.keys(error.errors).forEach(key => {
            const errorMessage = Array.isArray(error.errors[key]) ? error.errors[key][0] : error.errors[key];
            
            switch (key) {
              case 'organization_name':
                fieldErrors.organizationName = errorMessage;
                break;
              case 'email':
                fieldErrors.email = errorMessage;
                break;
              case 'first_name':
                fieldErrors.firstName = errorMessage;
                break;
              case 'last_name':
                fieldErrors.lastName = errorMessage;
                break;
              case 'funding_stage':
                fieldErrors.fundingStage = errorMessage;
                break;
              default:
                fieldErrors[key] = errorMessage;
            }
          });
          
          setErrors(fieldErrors);
        } else if (error.message) {
          setErrors({ general: error.message });
        } else {
          setErrors({ general: 'Failed to submit organization registration. Please check your data and try again.' });
        }
      } else {
        setErrors({ general: 'Network error. Please check your connection and try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 shadow-lg text-lg font-bold transition-all duration-300 ${
            currentStep >= step
            ? 'bg-gradient-to-br from-blue-500 to-green-400 border-blue-500 text-white scale-110'
            : 'border-gray-200 text-gray-400 bg-white'
          }`}>
            {currentStep > step ? (
              <CheckCircle size={22} />
            ) : (
              <span>{step}</span>
            )}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
              currentStep > step ? 'bg-blue-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your organization</h2>
        <p className="text-gray-600">Help us understand what type of organization you represent</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          What type of organization are you? *
        </label>
        {orgTypesLoading ? (
          <div className="text-gray-500">Loading organization types...</div>
        ) : orgTypesError ? (
          <div className="text-red-600">{orgTypesError}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizationTypes.map((type) => {
              // If backend returns icon as string, map to lucide-react icon here
              let IconComponent = Building2;
              if (type.icon === 'Building2') IconComponent = Building2;
              else if (type.icon === 'TrendingUp') IconComponent = TrendingUp;
              else if (type.icon === 'DollarSign') IconComponent = DollarSign;
              else if (type.icon === 'User') IconComponent = User;
              else if (type.icon === 'Zap') IconComponent = Zap;
              else if (type.icon === 'Globe') IconComponent = Globe;
              else if (type.icon === 'BookOpen') IconComponent = BookOpen;
              else if (type.icon === 'Building') IconComponent = Building;
              else if (type.icon === 'Heart') IconComponent = Heart;
              else if (type.icon === 'Users') IconComponent = Users;
              // ...add more mappings as needed
              return (
                <div
                  key={type.value}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.organizationType === type.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, organizationType: type.value }))}
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className={`mt-1 ${
                      formData.organizationType === type.value ? 'text-blue-600' : 'text-gray-400'
                    }`} size={20} />
                    <div>
                      <h3 className="font-medium text-gray-900">{type.label}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {errors.organizationType && (
          <p className="mt-2 text-sm text-red-600">{errors.organizationType}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
            Organization Name *
          </label>
          <input
            type="text"
            id="organizationName"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleInputChange}
            className="mt-1 form-input rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            placeholder="Enter your organization name"
          />
          {errors.organizationName && (
            <div className="mt-1">
              <p className="text-sm text-red-600">{errors.organizationName}</p>
              {errors.organizationName.includes('already registered') && (
                <p className="text-xs text-gray-500 mt-1">
                  💡 Try adding your location or year to make it unique (e.g., "YourCompany Addis Ababa" or "YourCompany 2024").
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            Website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="mt-1 form-input rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          className="mt-1 form-input rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
          placeholder="Describe what your organization does, its mission, and key activities..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
            Founded Year
          </label>
          <input
            type="number"
            id="foundedYear"
            name="foundedYear"
            value={formData.foundedYear}
            onChange={handleInputChange}
            className="mt-1 form-input rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            placeholder="2020"
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div>
          <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700">
            Employee Count
          </label>
          <select
            id="employeeCount"
            name="employeeCount"
            value={formData.employeeCount}
            onChange={handleInputChange}
            className="mt-1 form-input rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
          >
            <option value="">Select range</option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-500">201-500</option>
            <option value="501-1000">501-1000</option>
            <option value="1000+">1000+</option>
          </select>
        </div>

        <div>
          <label htmlFor="headquarters" className="block text-sm font-medium text-gray-700">
            Headquarters *
          </label>
          <input
            type="text"
            id="headquarters"
            name="headquarters"
            value={formData.headquarters}
            onChange={handleInputChange}
            className="mt-1 form-input rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            placeholder="Addis Ababa"
          />
          {errors.headquarters && (
            <p className="mt-1 text-sm text-red-600">{errors.headquarters}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your contact information</h2>
        <p className="text-gray-600">We'll use this to verify your organization and keep you updated</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="mt-1 form-input rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            placeholder="Your first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="mt-1 form-input rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            placeholder="Your last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 form-input rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            placeholder="your.email@company.com"
          />
          {errors.email && (
            <div className="mt-1">
              <p className="text-sm text-red-600">{errors.email}</p>
              {errors.email.includes('already registered') && (
                <p className="text-xs text-gray-500 mt-1">
                  💡 Try using a different email address or <a href="mailto:support@dealroom.com" className="text-blue-600 underline">contact support</a> if this is your organization.
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="mt-1 form-input rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            placeholder="+251 911 123456"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Your Position *
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="mt-1 form-input rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            placeholder="CEO, Founder, Partner, etc."
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-600">{errors.position}</p>
          )}
        </div>

        <div>
          <label htmlFor="linkedinProfile" className="block text-sm font-medium text-gray-700">
            LinkedIn Profile
          </label>
          <input
            type="url"
            id="linkedinProfile"
            name="linkedinProfile"
            value={formData.linkedinProfile}
            onChange={handleInputChange}
            className="mt-1 form-input rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Which sectors is your organization active in?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sectors.map((sector) => (
            <label key={sector} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sectors.includes(sector)}
                onChange={() => handleSectorChange(sector)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{sector}</span>
            </label>
          ))}
        </div>
      </div>

      {(formData.organizationType === 'startup' || formData.organizationType === 'scaleup') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fundingStage" className="block text-sm font-medium text-gray-700">
              Current Funding Stage
            </label>
            <select
              id="fundingStage"
              name="fundingStage"
              value={formData.fundingStage}
              onChange={handleInputChange}
              className="mt-1 form-input rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
            >
              <option value="">Select stage</option>
              {fundingStages.map((stage) => (
                <option key={stage.value} value={stage.value}>{stage.label}</option>
              ))}
            </select>
            {errors.fundingStage && (
              <p className="mt-1 text-sm text-red-600">{errors.fundingStage}</p>
            )}
          </div>

          <div>
            <label htmlFor="totalFunding" className="block text-sm font-medium text-gray-700">
              Total Funding Raised (USD)
            </label>
            <input
              type="number"
              id="totalFunding"
              name="totalFunding"
              value={formData.totalFunding}
              onChange={handleInputChange}
              className="mt-1 form-input rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
              placeholder="1000000"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="keyAchievements" className="block text-sm font-medium text-gray-700">
          Key Achievements or Milestones
        </label>
        <textarea
          id="keyAchievements"
          name="keyAchievements"
          rows={3}
          value={formData.keyAchievements}
          onChange={handleInputChange}
          className="mt-1 form-input rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
          placeholder="Share any notable achievements, awards, partnerships, or milestones..."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review and Submit</h2>
        <p className="text-gray-600">Review your information and submit your organization registration</p>
      </div>

      <div className="space-y-4">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            I agree to the{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
            *
          </span>
        </label>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
        )}

        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="subscribeNewsletter"
            checked={formData.subscribeNewsletter}
            onChange={handleInputChange}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            Subscribe to our newsletter for ecosystem updates and insights
          </span>
        </label>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-blue-600 mt-0.5" size={20} />
          <div>
            <h4 className="font-medium text-blue-900">What happens next?</h4>
            <p className="text-sm text-blue-700 mt-1">
              After submitting your application, our team will review your organization details. 
              You'll receive an email confirmation and we'll notify you once your profile is approved 
              and live on the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Success page component
  const renderSuccessPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center py-16 px-4">
      <div className="relative max-w-xl w-full mx-auto">
        {/* Confetti SVG */}
        <svg className="absolute left-0 top-0 w-full h-full pointer-events-none z-0 animate-fade-in" viewBox="0 0 600 400" fill="none">
          <g>
            <circle cx="100" cy="60" r="8" fill="#60A5FA" opacity="0.5"/>
            <circle cx="500" cy="80" r="6" fill="#34D399" opacity="0.5"/>
            <circle cx="300" cy="30" r="5" fill="#FBBF24" opacity="0.5"/>
            <rect x="200" y="350" width="10" height="10" fill="#F472B6" opacity="0.5" rx="2"/>
            <rect x="420" y="320" width="8" height="8" fill="#A78BFA" opacity="0.5" rx="2"/>
            <circle cx="550" cy="350" r="7" fill="#F87171" opacity="0.5"/>
          </g>
        </svg>
        <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center border border-green-200 z-10">
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 bg-gradient-to-br from-green-200 to-green-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-bounce-slow">
              <CheckCircle className="w-16 h-16 text-green-700" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-green-700 mb-4 tracking-tight drop-shadow-lg">Thank You!</h1>
          <p className="text-xl text-gray-700 mb-4 font-semibold">
            Your organization <span className="font-bold text-green-800">"{submissionData?.organizationName}"</span> has been registered.
          </p>
          <p className="text-base text-gray-500 mb-8">
            🚀 Your profile is now live and visible to investors, partners, and the ecosystem.<br/>
            <span className="inline-block mt-2 text-blue-500 font-medium">Redirecting to home page...</span>
          </p>
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 mb-8 shadow-sm">
            <div className="text-sm text-green-800">
              <p className="font-semibold mb-1">✅ Registration Complete</p>
              <p>Organization ID: <span className="font-mono">#{submissionData?.organizationId}</span></p>
              {submissionData?.companyId && (
                <p>Company ID: <span className="font-mono">#{submissionData?.companyId}</span></p>
              )}
            </div>
          </div>
          {/* Progress bar for redirect */}
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-8">
            <div className="h-full bg-gradient-to-r from-green-400 to-green-600 animate-progress-bar" style={{width: '100%'}}></div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-3 rounded-xl shadow hover:scale-105 transition-transform text-lg flex items-center justify-center gap-2"
            >
              🏠 Go to Home
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/companies')}
                className="bg-white border border-blue-200 text-blue-700 font-semibold py-3 rounded-xl shadow hover:bg-blue-50 transition-colors text-lg"
              >
                🏢 View Companies
              </button>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSubmissionData(null);
                  setCurrentStep(1);
                  setFormData({
                    organizationType: '',
                    organizationName: '',
                    website: '',
                    description: '',
                    foundedYear: '',
                    employeeCount: '',
                    headquarters: '',
                    country: 'Ethiopia',
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    position: '',
                    linkedinProfile: '',
                    sectors: [],
                    fundingStage: '',
                    totalFunding: '',
                    keyAchievements: '',
                    subscribeNewsletter: true
                  });
                  setErrors({});
                }}
                className="bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl shadow hover:bg-gray-50 transition-colors text-lg"
              >
                ➕ Add Another
              </button>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              🎉 Welcome to the Ethiopian startup ecosystem!<br/>Your organization is now part of our growing community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  React.useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, navigate]);

  // Keep these arrays for sectors and fundingStages
  const sectors = [
    'Fintech', 'Healthtech', 'Edtech', 'Agritech', 'E-commerce', 'Logistics',
    'Energy', 'Manufacturing', 'Tourism', 'Real Estate', 'Media & Entertainment',
    'Food & Beverage', 'Fashion', 'Automotive', 'Construction', 'Other'
  ];

  const fundingStages = [
    { value: 'pre_seed', label: 'Pre-seed' },
    { value: 'seed', label: 'Seed' },
    { value: 'series_a', label: 'Series A' },
    { value: 'series_b', label: 'Series B' },
    { value: 'series_c_plus', label: 'Series C+' },
    { value: 'growth', label: 'Growth' },
    { value: 'ipo', label: 'IPO' },
    { value: 'not_applicable', label: 'Not applicable' }
  ];

  // Show success page if submitted
  if (isSubmitted) {
    return renderSuccessPage();
  }

  return (
    <div className="signup-organization-page min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-fade-in">
      <div className="w-full max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 dealroom-gradient rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">D</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Add your organization</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Are you a founder, a VC, or otherwise active in the ecosystem? Gain visibility, 
            unlock more features, and help the database become more complete by adding your 
            organization for free.
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-blue-100">
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm">
              {errors.general}
            </div>
          )}
          {/* Helpful Info */}
          {(errors.email?.includes('already registered') || errors.organizationName?.includes('already registered')) && (
            <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-blue-400">ℹ️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold">Already registered?</h3>
                  <p className="mt-1 text-sm">
                    If this is your organization, please <a href="mailto:support@dealroom.com" className="text-blue-600 underline">contact support</a>. Otherwise, try using a different email address or make your organization name more specific.
                  </p>
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn btn-secondary bg-white border border-blue-200 text-blue-700 rounded-xl shadow hover:bg-blue-50 transition-colors"
                  >
                    Back
                  </button>
                )}
              </div>

              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="btn btn-ghost bg-transparent text-gray-500 hover:text-blue-600"
                >
                  Cancel
                </Link>
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    Submitte
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="loading mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      <>
                        Submit Organization
                        <CheckCircle size={16} className="ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupOrganizationPage;