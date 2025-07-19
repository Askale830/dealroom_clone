import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get token from localStorage
  const getStoredToken = () => {
    try {
      return localStorage.getItem('accessToken');
    } catch {
      return null;
    }
  };

  // Save token to localStorage
  const setStoredToken = (token) => {
    try {
      localStorage.setItem('accessToken', token);
    } catch {
      // Intentionally ignore error
    }
  };

  // Remove token from localStorage
  const removeStoredToken = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch {
      // Intentionally ignore error
    }
  };

  // On mount, check for existing token
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          setUser(null);
          removeStoredToken();
        } else {
          setUser({ username: decoded.username, email: decoded.email });
        }
      } catch (error) {
        setUser(null);
        removeStoredToken();
      }
    }
    setLoading(false);
  }, []);

  // LOGIN: Real API call
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || data.message || 'Login failed');
      }

      const data = await response.json();
      setStoredToken(data.access);
      localStorage.setItem('refreshToken', data.refresh);
      
      const decoded = jwtDecode(data.access);
      setUser({ username: decoded.username, email: decoded.email });
      setLoading(false);
      return { success: true };
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // REGISTER: Real API call
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || data.message || 'Registration failed');
      }

      setLoading(false);
      return { success: true };
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // LOGOUT
  const logout = () => {
    removeStoredToken();
    setUser(null);
    navigate('/login');
  };

  const clearError = () => setError(null);

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};