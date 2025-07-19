import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { universityAPI } from '../services/api';

const UniversitiesPage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    universityAPI.getAll().then(data => setUniversities(data.results || data)).finally(() => setLoading(false));
  }, []);
  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Universities</h1>
        <Link to="/universities/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Register Your University</Link>
      </div>
      <p className="mb-4 text-gray-600">See universities contributing to innovation and entrepreneurship in Ethiopia.</p>
      {loading ? (
        <div>Loading...</div>
      ) : universities.length === 0 ? (
        <div className="bg-white rounded shadow p-6 text-gray-700">No universities registered yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {universities.map(u => (
            <div key={u.id} className="bg-white rounded shadow p-4">
              <h2 className="text-xl font-semibold">{u.name}</h2>
              <p className="text-gray-600 mb-2">{u.city}, {u.region}</p>
              <p className="mb-2">{u.description}</p>
              {u.website && <a href={u.website} className="text-blue-600" target="_blank" rel="noopener noreferrer">Website</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UniversitiesPage;
