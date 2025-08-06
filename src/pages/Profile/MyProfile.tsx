import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress,
  Box,
  Grid,
  Divider
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Lock as LockIcon,
  Save as SaveIcon,
  Key as KeyIcon
} from '@mui/icons-material';
import { authAPI } from '../../services/api';
import './MyProfile.css';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const MyProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Personal info form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch current user data
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
      } else {
        setError('Failed to load user data');
      }
    } catch (err) {
      setError('An error occurred while loading user data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdatingProfile(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.updateProfile(user._id, { name, email });
      if (response.success) {
        setSuccess('Profile updated successfully!');
        setUser({ ...user, name, email });
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setUpdatingPassword(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.updatePassword(currentPassword, newPassword);
      if (response.success) {
        setSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(response.error || 'Failed to update password');
      }
    } catch (err) {
      setError('An error occurred while updating password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <Box className="profile-loading">
        <CircularProgress size={60} />
        <Typography variant="h6" className="mt-3">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <div className="profile-container">
      <Typography variant="h4" className="profile-title" style={{ marginTop: 0, paddingTop: 0 }}>
        My Profile
      </Typography>

      {error && (
        <Alert severity="error" className="mb-3" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className="mb-3" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <div className="forms-container">
        <Grid container spacing={2}>
          {/* Left Section - Personal Info */}
          <Grid item xs={12} md={6}>
            <Card className="profile-card">
              <CardContent>
                <Box className="card-header">
                  <PersonIcon className="card-icon" />
                  <Typography variant="h6" className="card-title">
                    Personal Information
                  </Typography>
                </Box>
                
                <Divider className="mb-3" />

                <form onSubmit={handleProfileUpdate}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    required
                    variant="outlined"
                  />
                  
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                    variant="outlined"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="mt-3"
                    disabled={updatingProfile}
                    startIcon={updatingProfile ? <CircularProgress size={20} /> : <SaveIcon />}
                  >
                    {updatingProfile ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Section - Password Update */}
          <Grid item xs={12} md={6}>
            <Card className="profile-card">
              <CardContent>
                <Box className="card-header">
                  <LockIcon className="card-icon" />
                  <Typography variant="h6" className="card-title">
                    Change Password
                  </Typography>
                </Box>
                
                <Divider className="mb-3" />

                <form onSubmit={handlePasswordUpdate}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    margin="normal"
                    required
                    variant="outlined"
                  />
                  
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    margin="normal"
                    required
                    variant="outlined"
                    helperText="Password must be at least 6 characters long"
                  />

                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    margin="normal"
                    required
                    variant="outlined"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    className="mt-3"
                    disabled={updatingPassword}
                    startIcon={updatingPassword ? <CircularProgress size={20} /> : <KeyIcon />}
                  >
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default MyProfile; 