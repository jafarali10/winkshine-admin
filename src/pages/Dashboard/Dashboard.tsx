import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  BookOnline as BookingsIcon,
  AttachMoney as RevenueIcon,
  Pending as PendingIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
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
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend, trendValue }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      border: '1px solid #e0e0e0',
      borderRadius: 3,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: color }}>
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingUpIcon sx={{ fontSize: 16, color: '#4caf50', mr: 0.5 }} />
              <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 500 }}>
                {trendValue} {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: '50%',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 15px ${color}40`,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  // Mock data - replace with actual API call
  const stats: DashboardStats = {
    totalUsers: 1250,
    totalBookings: 3420,
    totalRevenue: 45600,
    pendingBookings: 45,
    completedBookings: 2890,
    cancelledBookings: 485,
    monthlyStats: [],
    recentBookings: [],
    topServices: [],
    customerSatisfaction: 4.5,
  };

  const recentBookings = [
    {
      id: '1',
      customer: 'John Doe',
      service: 'Premium Wash',
      date: '2024-01-15',
      status: 'completed',
      amount: 45,
      avatar: 'JD',
    },
    {
      id: '2',
      customer: 'Jane Smith',
      service: 'Basic Wash',
      date: '2024-01-15',
      status: 'pending',
      amount: 25,
      avatar: 'JS',
    },
    {
      id: '3',
      customer: 'Mike Johnson',
      service: 'Luxury Detail',
      date: '2024-01-14',
      status: 'completed',
      amount: 120,
      avatar: 'MJ',
    },
    {
      id: '4',
      customer: 'Sarah Wilson',
      service: 'Premium Wash',
      date: '2024-01-14',
      status: 'in-progress',
      amount: 45,
      avatar: 'SW',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'in-progress':
        return '#2196f3';
      case 'cancelled':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status: string): React.ReactElement | undefined => {
    switch (status) {
      case 'completed':
        return <CompletedIcon sx={{ fontSize: 16 }} />;
      case 'pending':
        return <PendingIcon sx={{ fontSize: 16 }} />;
      case 'in-progress':
        return <CarWashIcon sx={{ fontSize: 16 }} />;
      case 'cancelled':
        return <CancelledIcon sx={{ fontSize: 16 }} />;
      default:
        return undefined;
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
          Welcome back, Admin! 👋
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Here's what's happening with your car wash business today
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={<PeopleIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#2196f3"
            trend="from last month"
            trendValue="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings.toLocaleString()}
            icon={<BookingsIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#4caf50"
            trend="this week"
            trendValue="+8%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<RevenueIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#ff9800"
            trend="this month"
            trendValue="+15%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Bookings"
            value={stats.pendingBookings}
            icon={<PendingIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#f44336"
          />
        </Grid>
      </Grid>

      {/* Additional Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completedBookings.toLocaleString()}
            icon={<CompletedIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Cancelled"
            value={stats.cancelledBookings.toLocaleString()}
            icon={<CancelledIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Customer Satisfaction"
            value={`${stats.customerSatisfaction}/5`}
            icon={<StarIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Bookings"
            value="12"
            icon={<BookingsIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#00bcd4"
          />
        </Grid>
      </Grid>

      {/* Recent Bookings Table */}
      <Paper 
        sx={{ 
          width: '100%', 
          overflow: 'hidden',
          borderRadius: 3,
          border: '1px solid #e0e0e0',
        }}
      >
        <Box sx={{ p: 3, backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            Recent Bookings
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Latest customer bookings and their status
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fafafa' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentBookings.map((booking) => (
                <TableRow key={booking.id} hover sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          mr: 2,
                          backgroundColor: '#1a237e',
                          fontSize: '0.875rem',
                        }}
                      >
                        {booking.avatar}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {booking.customer}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {booking.service}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {booking.date}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(booking.status)}
                      label={booking.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(booking.status),
                        color: 'white',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                      ${booking.amount}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Quick Stats Row */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1a237e' }}>
              Weekly Progress
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Bookings Target</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>85%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={85} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#4caf50',
                    borderRadius: 4,
                  },
                }} 
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Revenue Target</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>92%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={92} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#ff9800',
                    borderRadius: 4,
                  },
                }} 
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1a237e' }}>
              Today's Schedule
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4caf50', mr: 2 }} />
              <Typography variant="body2">9:00 AM - Premium Wash (John Doe)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ff9800', mr: 2 }} />
              <Typography variant="body2">11:30 AM - Basic Wash (Jane Smith)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2196f3', mr: 2 }} />
              <Typography variant="body2">2:00 PM - Luxury Detail (Mike Johnson)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#9c27b0', mr: 2 }} />
              <Typography variant="body2">4:30 PM - Premium Wash (Sarah Wilson)</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 