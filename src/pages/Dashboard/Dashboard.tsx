import React, { useState, useEffect } from 'react';
import {
  Category,
  People as PeopleIcon,
} from '@mui/icons-material';
import { DashboardStats } from '../../types';
import { dashboardAPI } from '../../services/api';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, loading = false }) => (
  <div className="card h-100 border-0 shadow-custom">
    <div className="card-body p-4">
      <div className="d-flex align-items-center justify-content-between">
        <div className="flex-grow-1">
          <h6 className="text-muted mb-2 fw-semibold">{title}</h6>
          <h2 className="fw-bold mb-0" style={{ color: color }}>
            {loading ? (
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              typeof value === 'number' ? value.toLocaleString() : value
            )}
          </h2>
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
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCategories : 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getStats();
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError(response.error || 'Failed to fetch dashboard stats');
        }
      } catch (err) {
        setError('An error occurred while fetching dashboard stats');
        console.error('Dashboard stats error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="container-fluid">
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

      {/* Error Message */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon />}
            color="#2196f3"
            loading={loading}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Total Category"
            value={stats.totalCategories}
            icon={<Category />}
            color="#2196f3"
            loading={loading}
          />
        </div>
      </div>
      

      
    </div>
  );
};

export default Dashboard; 