import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { acceleratorAPI } from '../services/api';

const AcceleratorsPage = () => {
  const [accelerators, setAccelerators] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    acceleratorAPI.getAll().then(data => setAccelerators(data.results || data)).finally(() => setLoading(false));
  }, []);
  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Accelerators</h1>
        <Link to="/accelerators/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Register Your Accelerator</Link>
      </div>
      <p className="mb-4 text-gray-600">Browse accelerators helping startups scale and grow in Ethiopia.</p>
      {loading ? (
        <div>Loading...</div>
      ) : accelerators.length === 0 ? (
        <div className="bg-white rounded shadow p-6 text-gray-700">No accelerators registered yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {accelerators.map(acc => (
            <div key={acc.id} className="bg-white rounded shadow p-4">
              <h2 className="text-xl font-semibold">{acc.name}</h2>
              <p className="text-gray-600 mb-2">{acc.city}, {acc.region}</p>
              <p className="mb-2">{acc.description}</p>
              {acc.website && <a href={acc.website} className="text-blue-600" target="_blank" rel="noopener noreferrer">Website</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcceleratorsPage;
