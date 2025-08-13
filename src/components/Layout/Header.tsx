import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useUser } from '../../contexts/UserContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top" 
         style={{ 
           zIndex: 1040, 
           borderBottom: '1px solid #e9ecef',
           height: '70px',
           padding: '0 1.5rem',
           left: '280px',
           right: '0',
           width: 'calc(100% - 280px)'
         }}>
      <div className="container-fluid p-0">
        
        {/* Mobile Menu Button */}
        <button
          className="navbar-toggler d-lg-none border-0 me-3"
          type="button"
          onClick={onMenuClick}
          style={{ 
            backgroundColor: 'rgba(26, 35, 126, 0.1)',
            borderRadius: '8px',
            padding: '8px'
          }}
        >
          <MenuIcon style={{ fontSize: '1.2rem', color: '#1a237e' }} />
        </button>
        
        {/* Brand */}
        <div className="navbar-brand d-flex flex-column">
          <h5 className="fw-bold text-primary mb-0" style={{ fontSize: '1.1rem' }}>
            Winkshine Car Wash
          </h5>
          <small className="text-muted d-none d-md-block" style={{ fontSize: '0.75rem' }}>
            Management Dashboard
          </small>
        </div>
        
        {/* Right Side Actions */}
        <div className="navbar-nav ms-auto align-items-center">
          
          {/* Status Badge */}
          <div className="nav-item me-3">
            <span className="badge px-2 py-1 rounded-pill"
                  style={{ 
                    backgroundColor: '#4caf50',
                    fontSize: '0.7rem',
                    fontWeight: '500'
                  }}>
              <small>Online</small>
            </span>
          </div>
          
          {/* Profile Dropdown */}
          <div className="nav-item dropdown">
            <button
              className="btn dropdown-toggle border-0 d-flex align-items-center rounded-3"
              type="button"
              data-bs-toggle="dropdown"
              data-bs-auto-close="true"
              aria-expanded="false"
              style={{ 
                backgroundColor: 'rgba(26, 35, 126, 0.1)',
                padding: '8px 12px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(26, 35, 126, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(26, 35, 126, 0.1)';
              }}
            >
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-2"
                   style={{ width: '32px', height: '32px' }}>
                <AccountCircleIcon style={{ color: 'white', fontSize: '1.2rem' }} />
              </div>
              <span className="d-none d-md-block fw-medium" style={{ color: '#1a237e' }}>
                {user?.name || 'Admin'}
              </span>
            </button>
            
            <ul className="dropdown-menu dropdown-menu-end shadow-custom border-0"
                style={{ 
                  minWidth: '220px',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef',
                  marginTop: '8px',
                  zIndex: 1050
                }}>
              <li>
                <div className="dropdown-header text-center py-3">
                  <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-2"
                       style={{ width: '48px', height: '48px' }}>
                    <AccountCircleIcon style={{ color: 'white', fontSize: '1.5rem' }} />
                  </div>
                  <h6 className="fw-bold text-primary mb-1" style={{ fontSize: '0.9rem' }}>
                    {user?.name || 'Admin User'}
                  </h6>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {user?.role === 'admin' ? 'Admin' : 'User'}
                  </small>
                </div>
              </li>
              <li><hr className="dropdown-divider my-0" /></li>
              <li>
                <button className="dropdown-item py-2 px-3" onClick={() => navigate('/profile')}>
                  <i className="bi bi-person me-2"></i>
                  <span style={{ fontSize: '0.85rem' }}>My Profile</span>
                </button>
              </li>
              <li><hr className="dropdown-divider my-0" /></li>
              <li>
                <button 
                  className="dropdown-item py-2 px-3 text-danger"
                  onClick={handleLogout}
                  style={{ fontSize: '0.85rem' }}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header; 