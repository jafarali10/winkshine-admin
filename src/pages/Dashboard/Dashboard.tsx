import React from 'react';
import {
  People as PeopleIcon,
  AttachMoney as RevenueIcon,
  TrendingUp as TrendingUpIcon,
  LocalCarWash as CarWashIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { DashboardStats } from '../../types';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="card h-100 border-0 shadow-custom">
    <div className="card-body p-4">
      <div className="d-flex align-items-center justify-content-between">
        <div className="flex-grow-1">
          <h6 className="text-muted mb-2 fw-semibold">{title}</h6>
          <h2 className="fw-bold mb-0" style={{ color: color }}>{value}</h2>
        </div>
        <div className="d-flex align-items-center justify-content-center rounded-circle"
             style={{
               backgroundColor: color,
               width: '60px',
               height: '60px',
               boxShadow: `0 4px 15px ${color}40`
             }}>
          <div style={{ color: 'white', fontSize: '1.75rem' }}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  // Mock data - replace with actual API call
  const stats: DashboardStats = {
    totalUsers: 1250,
    totalRevenue: 45600,
    monthlyStats: [],
    customerSatisfaction: 4.5,
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h3 fw-bold text-primary mb-2">
            Welcome back, Admin! 👋
          </h1>
          <p className="text-muted mb-0">
            Here's what's happening with your car wash business today
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
                 <div className="col-12 col-sm-6 col-lg-3">
           <StatCard
             title="Total Users"
             value={stats.totalUsers.toLocaleString()}
             icon={<PeopleIcon />}
             color="#2196f3"
           />
         </div>
      </div>

      
    </div>
  );
};

export default Dashboard; 