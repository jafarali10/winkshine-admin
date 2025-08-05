import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Chip,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - 280px)` },
        ml: { sm: `280px` },
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        color: '#1a237e',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar sx={{ px: 3 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ 
            mr: 2, 
            display: { sm: 'none' },
            backgroundColor: 'rgba(26, 35, 126, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(26, 35, 126, 0.2)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            Winkshine Car Wash
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Management Dashboard
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Notifications */}
          <IconButton 
            color="inherit"
            sx={{
              backgroundColor: 'rgba(26, 35, 126, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(26, 35, 126, 0.2)',
              },
            }}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Status Chip */}
          <Chip
            label="Online"
            size="small"
            sx={{
              backgroundColor: '#4caf50',
              color: 'white',
              fontSize: '0.7rem',
              height: 24,
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
          
          {/* User Profile */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{
              backgroundColor: 'rgba(26, 35, 126, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(26, 35, 126, 0.2)',
              },
            }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: '#1a237e',
                fontSize: '0.875rem',
                fontWeight: 'bold',
              }}
            >
              A
            </Avatar>
          </IconButton>
        </Box>
        
        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          id="primary-search-account-menu"
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              border: '1px solid #e0e0e0',
            },
          }}
        >
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48, 
                bgcolor: '#1a237e',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                mx: 'auto',
                mb: 1,
              }}
            >
              A
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              Admin User
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Super Administrator
            </Typography>
          </Box>
          
          <Divider />
          
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
            <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
            <Typography variant="body2">My Profile</Typography>
          </MenuItem>
          
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
            <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
            <Typography variant="body2">Settings</Typography>
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: '#f44336' }}>
            <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 