import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalCarWash as ServicesIcon,
  BookOnline as BookingsIcon,
  Star as ReviewsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  LocalCarWash as CarWashIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { 
    text: 'Dashboard', 
    icon: <DashboardIcon />, 
    path: '/dashboard',
    badge: null,
  },
  { 
    text: 'Users', 
    icon: <PeopleIcon />, 
    path: '/users',
    badge: '1.2K',
  },
  { 
    text: 'Services', 
    icon: <ServicesIcon />, 
    path: '/services',
    badge: '8',
  },
  { 
    text: 'Bookings', 
    icon: <BookingsIcon />, 
    path: '/bookings',
    badge: '45',
  },
  { 
    text: 'Reviews', 
    icon: <ReviewsIcon />, 
    path: '/reviews',
    badge: '156',
  },
  { 
    text: 'Settings', 
    icon: <SettingsIcon />, 
    path: '/settings',
    badge: null,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1a237e 0%, #3949ab 100%)',
          color: 'white',
          border: 'none',
          boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            mb: 2,
            border: '2px solid rgba(255,255,255,0.3)',
          }}
        >
          <CarWashIcon sx={{ fontSize: 28, color: 'white' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          Winkshine
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
          Car Wash Admin
        </Typography>
      </Box>
      
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mx: 2 }} />
      
      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, px: 2, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: 'bold',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'translateX(4px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ListItemIcon sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                minWidth: 40,
                transition: 'all 0.3s ease',
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  },
                }}
              />
              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '0.7rem',
                    height: 20,
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mx: 2 }} />
      
      {/* User Profile */}
      <Box sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              mr: 2,
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            A
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Admin User
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Super Admin
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Logout */}
      <List sx={{ px: 2, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                transform: 'translateX(4px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemIcon sx={{ color: '#f44336', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#f44336',
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar; 