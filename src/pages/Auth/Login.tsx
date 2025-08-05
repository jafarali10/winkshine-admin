import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
  Container,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  LocalCarWash as CarWashIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      if (response.success && response.data) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/dashboard');
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `,
          zIndex: 1,
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              mb: 2,
            }}
          >
            <CarWashIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              mb: 1,
            }}
          >
            Winkshine
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 300,
              mb: 3,
            }}
          >
            Car Wash Management System
          </Typography>
        </Box>

        <Paper
          elevation={24}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(255,255,255,0.95)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
              Admin Login
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
              Sign in to access your dashboard
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': { color: '#d32f2f' },
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                autoComplete="email"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#1a237e' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                    },
                  },
                }}
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#1a237e' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#1a237e' }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                  boxShadow: '0 4px 15px rgba(26, 35, 126, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
                    boxShadow: '0 6px 20px rgba(26, 35, 126, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s ease',
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                Demo Credentials
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Email: admin@winkshine.com
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Password: admin123
              </Typography>
            </Box>
          </CardContent>
        </Paper>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            © 2024 Winkshine Car Wash. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login; 