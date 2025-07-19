import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { universityAPI } from '../services/api';

const UniversityRegistrationForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    city: '',
    region: '',
    contact_email: '',
    contact_phone: '',
    logo_url: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.city || !form.region) {
      setError('Please fill all required fields.');
      return;
    }
    setError(null);
    try {
      await universityAPI.create(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Submission failed.');
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Thank you for registering your university!</h2>
        <p className="mb-6">Your submission has been received and will be reviewed by our team.</p>
        <button onClick={() => navigate('/universities')} className="px-6 py-2 bg-blue-600 text-white rounded-md">Go to Universities</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-4">University Registration</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name *</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">City *</label>
              <input name="city" value={form.city} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium">Region *</label>
              <input name="region" value={form.region} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
          </div>
          <div>
            <label className="block font-medium">Website</label>
            <input name="website" value={form.website} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Contact Email</label>
              <input name="contact_email" value={form.contact_email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium">Contact Phone</label>
              <input name="contact_phone" value={form.contact_phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block font-medium">Logo URL</label>
            <input name="logo_url" value={form.logo_url} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex justify-end mt-6">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UniversityRegistrationForm;
