import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { hubAPI } from '../services/api';

const HubsPage = () => {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    hubAPI.getAll().then(data => setHubs(data.results || data)).finally(() => setLoading(false));
  }, []);
  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Innovation Hubs</h1>
        <Link to="/hubs/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Register Your Hub</Link>
      </div>
      <p className="mb-4 text-gray-600">Explore Ethiopia's leading innovation and technology hubs supporting startups and entrepreneurs.</p>
      {loading ? (
        <div>Loading...</div>
      ) : hubs.length === 0 ? (
        <div className="bg-white rounded shadow p-6 text-gray-700">No hubs registered yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {hubs.map(hub => (
            <div key={hub.id} className="bg-white rounded shadow p-4">
              <h2 className="text-xl font-semibold">{hub.name}</h2>
              <p className="text-gray-600 mb-2">{hub.city}, {hub.region}</p>
              <p className="mb-2">{hub.description}</p>
              {hub.website && <a href={hub.website} className="text-blue-600" target="_blank" rel="noopener noreferrer">Website</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HubsPage;
