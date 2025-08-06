import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Paper,
  Grid
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { logoAPI } from '../../services/api';
import '../../styles/pages/Logo.css';

interface Logo {
  _id: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const Logo: React.FC = () => {
  const [logo, setLogo] = useState<Logo | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setImageError(false);
      const response = await logoAPI.get();
      if (response.success && response.data?.logo) {
        setLogo(response.data.logo);
      } else if (!response.success) {
        // If no logo found, that's okay - just don't set an error
        if (response.error !== 'No logo found') {
          setError(response.error || 'Failed to fetch logo');
        }
      }
    } catch (err: any) {
      console.error('Error fetching logo:', err);
      setError(err.error || 'Failed to fetch logo');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append('logo', selectedFile);

      const response = await logoAPI.upload(formData);

      if (response.success && response.data?.logo) {
        setLogo(response.data.logo);
        setSelectedFile(null);
        setPreviewUrl(null);
        setSuccess('Logo uploaded successfully!');

        // Reset file input
        const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } else if (!response.success) {
        setError(response.error || 'Failed to upload logo');
      }
    } catch (err: any) {
      console.error('Error uploading logo:', err);
      setError(err.error || 'Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  // Delete functionality removed - old logo is automatically deleted when new one is uploaded

  const getLogoUrl = useCallback((imagePath: string) => {
    // Direct URL construction
    const url = `http://localhost:5000${imagePath}`;
    return url;
  }, []);

  return (
    <Box className="container">

      <Typography variant="h4" gutterBottom className="title">
        Logo Management
      </Typography>

      <Grid container spacing={4}>
        {/* Current Logo Display */}
        <Grid item xs={12} md={6}>
          <Card className="card">
            <CardContent className="cardContent">
              <Typography variant="h6" gutterBottom className="cardTitle">
                Current Logo
              </Typography>
              {
                loading ?
                  (<Box className="loadingContainer"> <CircularProgress /> </Box>)
                  : logo ?
                    (
                      <Box className="logoContainer">
                        {
                          !imageError ? (
                            <Box
                              component="img"
                              src={getLogoUrl(logo.image)}
                              alt="Company Logo"
                              className="logoImage"
                              onError={() => {
                                setImageError(true);
                              }}
                              onLoad={() => {
                                setImageError(false);
                              }}
                            />
                          ) : (
                            <Box className="logoPlaceholder">
                              <Typography variant="h6">Logo</Typography>
                            </Box>
                          )
                        }
                        <Typography variant="body2" color="text.secondary">
                          Uploaded: {new Date(logo.createdAt).toLocaleDateString()}
                        </Typography>
                        {imageError && (
                          <Box>
                            <Typography variant="caption" color="error">
                              Failed to load image
                            </Typography>
                            <Typography variant="caption" display="block" color="text.secondary">
                              URL: {getLogoUrl(logo.image)}
                            </Typography>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Testing with placeholder image...
                            </Typography>
                            <Box
                              component="img"
                              src="https://via.placeholder.com/150x150.png?text=Test"
                              alt="Test Image"
                              className="testImage"
                            />
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box className="errorContainer">
                        <Typography variant="body2" color="text.secondary">
                          No logo uploaded yet
                        </Typography>
                      </Box>
                    )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upload Section */}
        <Grid item xs={12} md={6}>
          <Card className="card">
            <CardContent className="cardContent">
              <Typography variant="h6" gutterBottom className="cardTitle">
                Upload New Logo
              </Typography>

              <Box className="uploadContainer">
                {/* File Input */}
                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="fileInput"
                  />
                  <label htmlFor="logo-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      className="uploadButton"
                    >
                      Choose Image File
                    </Button>
                  </label>
                </Box>

                {/* File Preview */}
                {previewUrl && (
                  <Paper elevation={1} className="previewContainer">
                    <Typography variant="subtitle2" gutterBottom>
                      Preview:
                    </Typography>
                    <Box display="flex" justifyContent="center">
                      <Avatar
                        src={previewUrl}
                        alt="Preview"
                        className="previewAvatar"
                      />
                    </Box>
                    {selectedFile && (
                      <Typography variant="caption" display="block" className="fileInfo">
                        {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                    )}
                  </Paper>
                )}

                {/* Upload Button */}
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                  fullWidth
                  className="uploadActionButton"
                >
                  {uploading ? 'Uploading...' : 'Upload Logo'}
                </Button>

                {/* Instructions */}
                <Paper elevation={0} className="instructionsContainer">
                  <Typography variant="caption" display="block" gutterBottom>
                    <strong>Instructions:</strong>
                  </Typography>
                  <Typography variant="caption" display="block">
                    • Supported formats: JPEG, PNG, GIF, WebP
                  </Typography>
                  <Typography variant="caption" display="block">
                    • Maximum file size: 5MB
                  </Typography>
                  <Typography variant="caption" display="block">
                    • Uploading a new logo will automatically replace the current one
                  </Typography>
                  <Typography variant="caption" display="block">
                    • The old logo file will be automatically deleted
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {error && (
        <Alert severity="error" className="alertContainer" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className="alertContainer" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default Logo; 