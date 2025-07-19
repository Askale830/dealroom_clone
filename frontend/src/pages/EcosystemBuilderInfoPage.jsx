import React from 'react';
import { useNavigate } from 'react-router-dom';

const EcosystemBuilderInfoPage = ({ nextPath }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-4">Startup Ecosystem Builders Registration Form</h1>
        <p className="mb-4 text-gray-700">
          Welcome to the Startup Community Registration Form. This form is intended for founders, and startup ecosystem builders who wish to be part of the vibrant and interconnected startup community being developed in Ethiopia. By registering, you will join a growing network of innovators, support institutions, mentors, and investors working to transform national economies through innovation and technology.
        </p>
        <p className="mb-4 text-gray-700">
          Please fill out the form accurately. Your information will help us design better programs, create meaningful partnerships, and showcase the power of regional innovation.
        </p>
        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded">
          <strong>Note:</strong> All data will be treated confidentially and used solely for community development purposes.
        </div>
        <h2 className="text-lg font-semibold mb-2">Eligible Criteria for Registration</h2>
        <div className="mb-4">
          <h3 className="font-semibold">Ecosystem Builders:</h3>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Should have verifiable startup-related programs or services</li>
            <li>Should have operated for at least 3–12 months</li>
            <li>Must demonstrate openness to collaborate and support founders</li>
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Mentors/Trainers:</h3>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Should have relevant experience in business, technology, or development</li>
            <li>Should commit to at least 3 mentorship hours per quarter</li>
          </ul>
        </div>
        <div className="flex justify-end mt-8">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => navigate(nextPath)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EcosystemBuilderInfoPage;
