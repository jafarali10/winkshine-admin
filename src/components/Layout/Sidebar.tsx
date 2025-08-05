import React from 'react';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  LocalCarWash as CarWashIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

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
    <div className="d-none d-lg-block position-fixed top-0 start-0 h-100"
         style={{
           width: '280px',
           background: 'linear-gradient(180deg, #1a237e 0%, #3949ab 100%)',
           color: 'white',
           zIndex: 1020,
           boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
         }}>
      
      {/* Header */}
      <div className="text-center p-4">
        <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
             style={{
               width: '60px',
               height: '60px',
               backgroundColor: 'rgba(255,255,255,0.2)',
               backdropFilter: 'blur(10px)',
               border: '2px solid rgba(255,255,255,0.3)'
             }}>
          <CarWashIcon style={{ fontSize: '1.75rem', color: 'white' }} />
        </div>
        <h6 className="fw-bold mb-1">Winkshine</h6>
        <small style={{ opacity: 0.8, fontSize: '0.75rem' }}>Car Wash Admin</small>
      </div>
      
      <hr style={{ backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 1rem' }} />
      
      {/* Navigation Menu */}
      <div className="flex-grow-1 px-3 pt-3">
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li key={item.text} className="nav-item mb-2">
              <button
                className={`btn w-100 text-start border-0 rounded-3 ${
                  location.pathname === item.path 
                    ? 'text-white' 
                    : 'text-white-50'
                }`}
                onClick={() => handleNavigation(item.path)}
                style={{
                  backgroundColor: location.pathname === item.path 
                    ? 'rgba(255,255,255,0.15)' 
                    : 'transparent',
                  backdropFilter: location.pathname === item.path ? 'blur(10px)' : 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <div className="d-flex align-items-center">
                  <div className="me-3" style={{ minWidth: '40px' }}>
                    {item.icon}
                  </div>
                  <span className="fw-medium" style={{ fontSize: '0.9rem' }}>
                    {item.text}
                  </span>
                  {item.badge && (
                    <span className="badge ms-auto"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            fontSize: '0.7rem',
                            height: '20px'
                          }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <hr style={{ backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 1rem' }} />
      
      {/* User Profile */}
      <div className="p-3 mb-3">
        <div className="d-flex align-items-center mb-3">
          <div className="rounded-circle bg-white bg-opacity-20 d-flex align-items-center justify-content-center me-3"
               style={{
                 width: '40px',
                 height: '40px',
                 border: '2px solid rgba(255,255,255,0.3)'
               }}>
            <span className="fw-bold text-white">A</span>
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: '0.875rem' }}>Admin User</div>
            <small style={{ opacity: 0.8, fontSize: '0.75rem' }}>Super Admin</small>
          </div>
        </div>
      </div>
      
      {/* Logout */}
      <div className="px-3 pb-3">
        <button
          className="btn w-100 text-start border rounded-3"
          onClick={handleLogout}
          style={{
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            borderColor: 'rgba(244, 67, 54, 0.3)',
            color: '#f44336',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(244, 67, 54, 0.2)';
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <div className="d-flex align-items-center">
            <div className="me-3" style={{ minWidth: '40px' }}>
              <LogoutIcon />
            </div>
            <span className="fw-medium" style={{ fontSize: '0.9rem' }}>Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 