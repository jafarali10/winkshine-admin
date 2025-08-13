import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalCarWash as CarWashIcon, Email, Lock } from '@mui/icons-material';
import { authAPI } from '../../services/api';
import { logoAPI } from '../../services/api';
import { useUser } from '../../contexts/UserContext';
import './Login.css';

const getLogoUrl = (imagePath: string) => `http://localhost:5000${imagePath}`;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logo, setLogo] = useState<any>(null);
  const [logoLoading, setLogoLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // User is already logged in, redirect to dashboard
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  // Fetch logo on mount
  useEffect(() => {
    (async () => {
      setLogoLoading(true);
      setLogoError(false);
      try {
        const response = await logoAPI.get();
        if (response.success && response.data?.logo) {
          setLogo(response.data.logo);
        }
      } catch (err) {
        setLogoError(true);
      } finally {
        setLogoLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        // Check if user has admin role
        if (response.data?.user?.role !== 'admin') {
          setError('Invalid email or password');
          // Clear the token if it was stored
          localStorage.removeItem('adminToken');
          return;
        }
        // Set user in context
        setUser(response.data.user);
        navigate('/dashboard');
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Remove animated bubbles and use split layout
  return (
    <div className="login-split-bg">
      <div className="login-split-left">
        <div className="login-logo-circle-container login-logo-circle-left">
          {logoLoading ? (
            <div className="spinner-custom mx-auto" style={{ width: 96, height: 96 }}></div>
          ) : logo && !logoError ? (
            <img
              src={getLogoUrl(logo.image)}
              alt="Winkshine Logo"
              className="login-logo-img-circle login-logo-img-left"
            />
          ) : (
            <div className="login-logo-fallback-large">Winkshine</div>
          )}
        </div>
      </div>
      <div className="login-split-right d-flex align-items-center justify-content-center">
        <div className="login-form-container">
          <div className="login-logo-container text-center mb-4">
            {logoLoading ? (
              <div className="spinner-custom mx-auto" style={{ width: 64, height: 64 }}></div>
            ) : logo && !logoError ? (
              <div className="login-logo-circle-container">
                <img
                  src={getLogoUrl(logo.image)}
                  alt="Winkshine Logo"
                  className="login-logo-img-circle"
                />
              </div>
            ) : (
              <div className="login-logo-fallback">Winkshine</div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="login-form-fields">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                <span className="label-icon"><Email fontSize="small" /></span>
                Email
              </label>
              <input
                type="email"
                className="form-control form-control-lg input-focus"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                <span className="label-icon"><Lock fontSize="small" /></span>
                Password
              </label>
              <input
                type="password"
                className="form-control form-control-lg input-focus"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="btn login-btn btn-lg w-100"
              disabled={loading}
            >
              {loading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <div className="spinner-custom me-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
            <div className="d-flex justify-content-start align-items-center mt-3">
              <a href="#" className="login-link">Forgot Password?</a>
            </div>
          </form>
          {error && (
            <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 