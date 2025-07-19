import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const { register, user, loading, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const result = await register(formData.username, formData.email, formData.password);
    if (result.success) {
      setSuccess('Registration successful! You can now log in.');
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } else {
      setErrors({ form: result.error || 'Registration failed' });
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light" style={{
      backgroundImage: 'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: 500, width: '100%', background: 'rgba(255,255,255,0.85)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', color: '#1a237e', border: 'none' }}>
        <div className="text-center mb-4">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src="https://storage.googleapis.com/dealroom-ecosystems-production/ethiopia/logo.png"
              alt="StartupEthiopia Logo"
              style={{ width: 80, height: 80, objectFit: 'contain', margin: '0 auto 12px auto', borderRadius: 0, display: 'block', opacity: 0.98 }}
            />
          </div>
          <h2 className="mt-2 fw-bold" style={{ color: '#1a237e' }}>Create your account</h2>
          <p className="text-muted" style={{ color: '#1a237e' }}>
            Already have an account?{' '}
            <Link to="/login" className="fw-semibold" style={{ color: '#1976d2' }}>
              Sign in
            </Link>
          </p>
        </div>
        <form className="mb-3" onSubmit={handleSubmit}>
          {success && (
            <div className="alert alert-success py-2" style={{ color: '#1a237e', background: 'rgba(26,35,126,0.08)', borderColor: '#1a237e' }}>{success}</div>
          )}
          {errors.form && (
            <div className="alert alert-danger py-2" style={{ color: '#d32f2f', background: 'rgba(211,47,47,0.08)', borderColor: '#d32f2f' }}>{errors.form}</div>
          )}
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="first_name" className="form-label" style={{ color: '#1a237e' }}>
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                className="form-control"
                value={formData.first_name}
                onChange={handleChange}
                required
                style={{ color: '#1a237e', borderColor: '#1976d2' }}
              />
              {errors.first_name && (
                <div className="text-danger small" style={{ color: '#d32f2f' }}>{errors.first_name}</div>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="last_name" className="form-label" style={{ color: '#1a237e' }}>
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                className="form-control"
                value={formData.last_name}
                onChange={handleChange}
                required
                style={{ color: '#1a237e', borderColor: '#1976d2' }}
              />
              {errors.last_name && (
                <div className="text-danger small" style={{ color: '#d32f2f' }}>{errors.last_name}</div>
              )}
            </div>
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="username" className="form-label" style={{ color: '#1a237e' }}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
              style={{ color: '#1a237e', borderColor: '#1976d2' }}
            />
            {errors.username && (
              <div className="text-danger small" style={{ color: '#d32f2f' }}>{errors.username}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{ color: '#1a237e' }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ color: '#1a237e', borderColor: '#1976d2' }}
            />
            {errors.email && (
              <div className="text-danger small" style={{ color: '#d32f2f' }}>{errors.email}</div>
            )}
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="password" className="form-label" style={{ color: '#1a237e' }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ color: '#1a237e', borderColor: '#1976d2' }}
              />
              {errors.password && (
                <div className="text-danger small" style={{ color: '#d32f2f' }}>{errors.password}</div>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="confirmPassword" className="form-label" style={{ color: '#1a237e' }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{ color: '#1a237e', borderColor: '#1976d2' }}
              />
              {errors.confirmPassword && (
                <div className="text-danger small" style={{ color: '#d32f2f' }}>{errors.confirmPassword}</div>
              )}
            </div>
          </div>
          <div className="form-check mt-3 mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className="form-check-label" htmlFor="showPassword" style={{ color: '#1a237e' }}>
              Show Passwords
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn w-100 fw-bold py-2 mt-2"
            style={{ background: '#1976d2', color: 'white', border: 'none' }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : null}
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;