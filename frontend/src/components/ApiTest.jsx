import React, { useState, useEffect } from 'react';

const ApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [dashboardResult, setDashboardResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnections();
  }, []);

  const testConnections = async () => {
    setLoading(true);
    
    // Test basic connection
    try {
      console.log('Testing basic API connection...');
      const response = await fetch('http://127.0.0.1:8000/api/test/');
      const data = await response.json();
      console.log('Test response:', data);
      setTestResult(data);
    } catch (error) {
      console.error('Test API error:', error);
      setTestResult({ error: error.message });
    }

    // Test dashboard endpoint
    try {
      console.log('Testing dashboard API...');
      const response = await fetch('http://127.0.0.1:8000/api/dashboard/');
      const data = await response.json();
      console.log('Dashboard response:', data);
      setDashboardResult(data);
    } catch (error) {
      console.error('Dashboard API error:', error);
      setDashboardResult({ error: error.message });
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Testing API connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Test Endpoint</h2>
            <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              <pre className="text-sm">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Dashboard Endpoint</h2>
            <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              <pre className="text-sm">
                {JSON.stringify(dashboardResult, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={testConnections}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mr-4"
          >
            Retry Tests
          </button>
          
          <a 
            href="/dashboard" 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
          >
            Go to Dashboard
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${testResult?.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            <h3 className={`font-semibold ${testResult?.error ? 'text-red-800' : 'text-green-800'}`}>
              Test Endpoint Status
            </h3>
            <p className={`text-sm ${testResult?.error ? 'text-red-600' : 'text-green-600'}`}>
              {testResult?.error ? 'Failed' : 'Connected'}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${dashboardResult?.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            <h3 className={`font-semibold ${dashboardResult?.error ? 'text-red-800' : 'text-green-800'}`}>
              Dashboard Endpoint Status
            </h3>
            <p className={`text-sm ${dashboardResult?.error ? 'text-red-600' : 'text-green-600'}`}>
              {dashboardResult?.error ? 'Failed' : 'Connected'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTest;