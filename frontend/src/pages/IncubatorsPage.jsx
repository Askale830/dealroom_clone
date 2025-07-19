import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { incubatorAPI } from '../services/api';

const IncubatorsPage = () => {
  const [incubators, setIncubators] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    incubatorAPI.getAll().then(data => setIncubators(data.results || data)).finally(() => setLoading(false));
  }, []);
  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Incubators</h1>
        <Link to="/incubators/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Register Your Incubator</Link>
      </div>
      <p className="mb-4 text-gray-600">Discover incubators nurturing early-stage startups in Ethiopia's ecosystem.</p>
      {loading ? (
        <div>Loading...</div>
      ) : incubators.length === 0 ? (
        <div className="bg-white rounded shadow p-6 text-gray-700">No incubators registered yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {incubators.map(inc => (
            <div key={inc.id} className="bg-white rounded shadow p-4">
              <h2 className="text-xl font-semibold">{inc.name}</h2>
              <p className="text-gray-600 mb-2">{inc.city}, {inc.region}</p>
              <p className="mb-2">{inc.description}</p>
              {inc.website && <a href={inc.website} className="text-blue-600" target="_blank" rel="noopener noreferrer">Website</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncubatorsPage;
