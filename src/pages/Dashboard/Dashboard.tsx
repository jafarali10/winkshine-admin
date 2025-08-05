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
  trend?: string;
  trendValue?: string;
  variant?: 'users' | 'revenue' | 'satisfaction' | 'orders';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend, trendValue, variant = 'users' }) => (
  <div className="card h-100 border-0 shadow-custom">
    <div className="card-body p-4">
      <div className="d-flex align-items-center justify-content-between">
        <div className="flex-grow-1">
          <h6 className="text-muted mb-2 fw-semibold">{title}</h6>
          <h2 className="fw-bold mb-2" style={{ color: color }}>{value}</h2>
          {trend && (
            <div className="d-flex align-items-center">
              <TrendingUpIcon style={{ fontSize: '1rem', color: '#4caf50', marginRight: '0.25rem' }} />
              <small className="text-success fw-semibold">
                {trendValue} {trend}
              </small>
            </div>
          )}
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
            trend="from last month"
            trendValue="+12%"
            variant="users"
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<RevenueIcon />}
            color="#4caf50"
            trend="from last month"
            trendValue="+8%"
            variant="revenue"
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Customer Satisfaction"
            value={stats.customerSatisfaction}
            icon={<StarIcon />}
            color="#ff9800"
            trend="from last month"
            trendValue="+0.2"
            variant="satisfaction"
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Total Orders"
            value="1,847"
            icon={<CarWashIcon />}
            color="#9c27b0"
            trend="from last month"
            trendValue="+15%"
            variant="orders"
          />
        </div>
      </div>

      {/* Additional Dashboard Content */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-custom">
            <div className="card-header">
              <h5 className="card-title mb-0 text-white">Recent Activity</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                     style={{ width: '40px', height: '40px' }}>
                  <PeopleIcon style={{ color: 'white', fontSize: '1.2rem' }} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">New user registered</h6>
                  <small className="text-muted">John Doe joined the platform</small>
                </div>
                <small className="text-muted">2 min ago</small>
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3"
                     style={{ width: '40px', height: '40px' }}>
                  <RevenueIcon style={{ color: 'white', fontSize: '1.2rem' }} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">New order completed</h6>
                  <small className="text-muted">Premium car wash service</small>
                </div>
                <small className="text-muted">15 min ago</small>
              </div>
              
              <div className="d-flex align-items-center">
                <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3"
                     style={{ width: '40px', height: '40px' }}>
                  <StarIcon style={{ color: 'white', fontSize: '1.2rem' }} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">New review received</h6>
                  <small className="text-muted">5-star rating from customer</small>
                </div>
                <small className="text-muted">1 hour ago</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-custom">
            <div className="card-header">
              <h5 className="card-title mb-0 text-white">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary">
                  <PeopleIcon className="me-2" />
                  Add New User
                </button>
                <button className="btn btn-outline-success">
                  <CarWashIcon className="me-2" />
                  Create Order
                </button>
                <button className="btn btn-outline-info">
                  <TrendingUpIcon className="me-2" />
                  View Reports
                </button>
                <button className="btn btn-outline-warning">
                  <StarIcon className="me-2" />
                  Manage Reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 