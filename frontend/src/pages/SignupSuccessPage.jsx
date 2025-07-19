import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, Mail, Clock, Users } from 'lucide-react';

const SignupSuccessPage = () => {
  const location = useLocation();
  const { organizationName, organizationType } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={40} />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>
          
          {organizationName && (
            <p className="text-xl text-gray-600 mb-8">
              Thank you for submitting <strong>{organizationName}</strong> to the Ethiopia Dealroom platform.
            </p>
          )}

          {/* What's Next Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">What happens next?</h2>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <Mail className="text-blue-600 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-blue-900">Email Confirmation</h3>
                  <p className="text-sm text-blue-700">
                    You'll receive a confirmation email shortly with your application details.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="text-blue-600 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-blue-900">Review Process</h3>
                  <p className="text-sm text-blue-700">
                    Our team will review your organization details within 2-3 business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="text-blue-600 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-blue-900">Profile Activation</h3>
                  <p className="text-sm text-blue-700">
                    Once approved, your organization will be live on the platform and you'll gain access to all features.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Benefits of being on Ethiopia Dealroom
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Visibility & Discovery</h3>
                <p className="text-sm text-gray-600">
                  Get discovered by investors, partners, and other ecosystem players
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Network Access</h3>
                <p className="text-sm text-gray-600">
                  Connect with other organizations in the Ethiopian ecosystem
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Market Insights</h3>
                <p className="text-sm text-gray-600">
                  Access comprehensive data and analytics about the ecosystem
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Profile Management</h3>
                <p className="text-sm text-gray-600">
                  Keep your organization information up-to-date and accurate
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn btn-primary"
            >
              Explore the Platform
              <ArrowRight size={16} className="ml-2" />
            </Link>
            
            <Link
              to="/companies"
              className="btn btn-secondary"
            >
              Browse Companies
            </Link>
          </div>

          {/* Contact Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Have questions about your application?{' '}
              <a 
                href="mailto:support@ethiopia.dealroom.co" 
                className="text-blue-600 hover:text-blue-500"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccessPage;