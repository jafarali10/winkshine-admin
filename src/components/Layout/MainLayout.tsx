import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="d-flex">
      <Header onMenuClick={handleDrawerToggle} />
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
      
      <main className="flex-grow-1"
            style={{
              marginLeft: '280px',
              marginTop: '70px',
              backgroundColor: '#f8f9fa',
              minHeight: 'calc(100vh - 70px)',
              padding: '1.5rem'
            }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 