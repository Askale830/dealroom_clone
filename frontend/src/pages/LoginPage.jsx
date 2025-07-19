import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login, user, loading: contextLoading, error: contextError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before login
  const from = location.state?.from?.pathname || '/dashboard';
  // Check for success message from registration
  const successMessage = location.state?.message;

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await login(formData.username, formData.password);
    if (result.success) {
      navigate(from, { replace: true });
    } // error will be shown below if login fails
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light" style={{
      backgroundImage: 'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: 400, width: '100%', background: 'rgba(255,255,255,0.85)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', color: '#1a237e', border: 'none' }}>
        <div className="text-center mb-4">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src="https://storage.googleapis.com/dealroom-ecosystems-production/ethiopia/logo.png"
              alt="StartupEthiopia Logo"
              style={{ width: 80, height: 80, objectFit: 'contain', margin: '0 auto 12px auto', borderRadius: 0, display: 'block', opacity: 0.98 }}
            />
          </div>
          <h2 className="mt-2 fw-bold" style={{ color: '#1a237e' }}>Sign in to your account</h2>
          <p className="text-muted" style={{ color: '#1a237e' }}>
            Or{' '}
            <Link to="/register" className="fw-semibold" style={{ color: '#1976d2' }}>
              create a new account
            </Link>
          </p>
        </div>
        <form className="mb-3" onSubmit={handleSubmit}>
          {successMessage && (
            <div className="alert alert-success py-2" style={{ color: '#1a237e', background: 'rgba(26,35,126,0.08)', borderColor: '#1a237e' }}>{successMessage}</div>
          )}
          {contextError && (
            <div className="alert alert-danger py-2" style={{ color: '#d32f2f', background: 'rgba(211,47,47,0.08)', borderColor: '#d32f2f' }}>{contextError}</div>
          )}
          <div className="mb-3">
            <label htmlFor="username" className="form-label" style={{ color: '#1a237e' }}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="form-control"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              style={{ color: '#1a237e', borderColor: '#1976d2' }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label" style={{ color: '#1a237e' }}>
              Password
            </label>
            <div className="input-group">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={{ color: '#1a237e', borderColor: '#1976d2' }}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                style={{ color: '#1976d2', borderColor: '#1976d2' }}
              >
                {showPassword ? <EyeOff className="" /> : <Eye className="" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={contextLoading}
            className="btn w-100 fw-bold py-2 mt-2"
            style={{ background: '#1976d2', color: 'white', border: 'none' }}
          >
            {contextLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;