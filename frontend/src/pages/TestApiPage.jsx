import React, { useState } from 'react';
import { organizationRegistrationAPI } from '../services/api';

const TestApiPage = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('');

    const testData = {
      organization_type: "startup",
      organization_name: "Frontend Test Startup",
      description: "A test from frontend",
      headquarters: "Addis Ababa",
      country: "Ethiopia",
      first_name: "Test",
      last_name: "User",
      email: "test@frontend.com",
      position: "CEO",
      sectors: [],
      subscribe_newsletter: true
    };

    console.log('Testing with data:', JSON.stringify(testData, null, 2));

    try {
      const response = await organizationRegistrationAPI.create(testData);
      console.log('Success response:', JSON.stringify(response, null, 2));
      setResult(`SUCCESS: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.error('Error response:', JSON.stringify(error, null, 2));
      setResult(`ERROR: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <button
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Organization Registration API'}
        </button>

        {result && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Result:</h2>
            <pre className="text-sm overflow-auto">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestApiPage;