import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalCarWash as CarWashIcon, Email, Lock } from '@mui/icons-material';
import { authAPI } from '../../services/api';
import { logoAPI } from '../../services/api';
import './Login.css';

const getLogoUrl = (imagePath: string) => `http://localhost:5000${imagePath}`;

const Login: React.FC = () => {
  const navigate = useNavigate();
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
        <div className="login-logo-left-container">
          {logoLoading ? (
            <div className="spinner-custom mx-auto" style={{ width: 96, height: 96 }}></div>
          ) : logo && !logoError ? (
            <img
              src={getLogoUrl(logo.image)}
              alt="Winkshine Logo"
              className="login-logo-left-img"
            />
          ) : (
            <div className="login-logo-fallback-large">Winkshine</div>
          )}
        </div>
      </div>
      <div className="login-split-right d-flex align-items-center justify-content-center">
        <div className="login-form-container login-form-premium-card">
          <div className="login-logo-container text-center mb-4">
            {logoLoading ? (
              <div className="spinner-custom mx-auto" style={{ width: 64, height: 64 }}></div>
            ) : logo && !logoError ? (
              <img
                src={getLogoUrl(logo.image)}
                alt="Winkshine Logo"
                className="login-logo-img login-logo-img-large"
              />
            ) : (
              <div className="login-logo-fallback">Winkshine</div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="login-form-fields login-form-premium-fields">
            <div className="mb-4 position-relative">
              <label htmlFor="email" className="form-label">Email</label>
              <span className="input-icon"><Email fontSize="small" /></span>
              <input
                type="email"
                className="form-control form-control-lg input-focus login-input-premium"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{ paddingLeft: '1.8rem' }}
              />
            </div>
            <div className="mb-4 position-relative">
              <label htmlFor="password" className="form-label">Password</label>
              <span className="input-icon"><Lock fontSize="small" /></span>
              <input
                type="password"
                className="form-control form-control-lg input-focus login-input-premium"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{ paddingLeft: '1.8rem' }}
              />
            </div>
            <button
              type="submit"
              className="btn login-btn login-btn-premium btn-lg w-100"
              disabled={loading}
            >
              {loading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <div className="spinner-custom me-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <a href="#" className="login-link">Forgot Password?</a>
              <button type="button" className="signup-btn-premium">Sign Up</button>
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