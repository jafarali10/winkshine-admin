import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalCarWash as CarWashIcon } from '@mui/icons-material';
import { authAPI } from '../../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // User is already logged in, redirect to dashboard
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

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

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
           position: 'relative',
           overflow: 'hidden'
         }}>
      
      {/* Background Pattern */}
      <div className="position-absolute w-100 h-100" 
           style={{
             backgroundImage: `
               radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
               radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)
             `,
             zIndex: 1
           }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            
            {/* Logo and Title */}
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                   style={{
                     width: '80px',
                     height: '80px',
                     backgroundColor: 'rgba(255,255,255,0.2)',
                     backdropFilter: 'blur(10px)'
                   }}>
                <CarWashIcon style={{ fontSize: '2.5rem', color: 'white' }} />
              </div>
              <h1 className="text-white fw-bold mb-2" 
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                Winkshine
              </h1>
              <h6 className="text-white-50 fw-light">
                Car Wash Management System
              </h6>
            </div>

            {/* Login Form */}
            <div className="card shadow-custom-lg border-0"
                 style={{
                   background: 'rgba(255,255,255,0.95)',
                   backdropFilter: 'blur(20px)',
                   borderRadius: '1rem'
                 }}>
              <div className="card-body p-4">
                
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
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
                </form>
                
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-white-50 mb-0">
                © 2024 Winkshine Car Wash. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 