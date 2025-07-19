import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { universityAPI } from '../services/api';

const RegisterUniversityPage = () => {
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
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
        backgroundImage: 'url(https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '40px 0'
      }}>
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center relative overflow-hidden border border-gray-100" style={{ background: 'rgba(255,255,255,0.92)' }}>
          <div className="flex justify-center mb-6 z-10 relative">
            <svg className="w-20 h-20 text-green-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#ecfdf5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 12l3 3 5-5" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 z-10 relative font-sans">Thank you for registering your university!</h2>
          <p className="text-lg text-gray-600 mb-6 z-10 relative font-sans">Your submission has been received and will be reviewed by our team.</p>
          <button
            onClick={() => navigate('/universities')}
            className="px-8 py-3 bg-gradient-to-r from-[#ffb300] to-[#ff7c00] text-white rounded-lg text-lg font-semibold shadow-md hover:from-[#ffb300] hover:to-[#ff9800] transition z-10 relative font-sans"
          >
            Go to Universities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center" style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
      backgroundImage: 'url(https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: '40px 0'
    }}>
      <div className="max-w-2xl mx-auto" style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 24, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)', padding: 40 }}>
        <h1 className="text-2xl fw-bold mb-4 text-center" style={{ color: '#1976d2', letterSpacing: 1 }}>Register Your University</h1>
        {error && <div className="alert alert-danger mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block font-semibold mb-1 text-gray-800">Name <span className="text-red-500">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#ffb300] focus:border-[#ffb300] bg-[#f9fafb]" required />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-800">City <span className="text-red-500">*</span></label>
              <input name="city" value={form.city} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#ffb300] focus:border-[#ffb300] bg-[#f9fafb]" required />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-800">Region <span className="text-red-500">*</span></label>
              <input name="region" value={form.region} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#ffb300] focus:border-[#ffb300] bg-[#f9fafb]" required />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-800">Website</label>
              <input name="website" value={form.website} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#ffb300] focus:border-[#ffb300] bg-[#f9fafb]" />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-800">Contact Email</label>
              <input name="contact_email" value={form.contact_email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#ffb300] focus:border-[#ffb300] bg-[#f9fafb]" />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-800">Contact Phone</label>
              <input name="contact_phone" value={form.contact_phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#ffb300] focus:border-[#ffb300] bg-[#f9fafb]" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1 text-gray-800">Logo URL</label>
              <input name="logo_url" value={form.logo_url} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#ffb300] focus:border-[#ffb300] bg-[#f9fafb]" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1 text-gray-800">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#ffb300] focus:border-[#ffb300] bg-[#f9fafb]" rows={3} />
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button type="submit" className="px-8 py-3 bg-gradient-to-r from-[#ffb300] to-[#ff7c00] hover:from-[#ffb300] hover:to-[#ff9800] text-white rounded-lg text-lg font-semibold shadow-md transition font-sans">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUniversityPage;
