// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Service types
export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: 'basic' | 'premium' | 'luxury';
  isActive: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Booking types
export interface Booking {
  _id: string;
  user: User;
  service: Service;
  scheduledDate: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface Review {
  _id: string;
  user: User;
  service: Service;
  booking: Booking;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  monthlyStats: MonthlyStat[];
  recentBookings: Booking[];
  topServices: Service[];
  customerSatisfaction: number;
}

export interface MonthlyStat {
  month: string;
  bookings: number;
  revenue: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Settings types
export interface BusinessSettings {
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  pricing: {
    currency: string;
    taxRate: number;
    discountPercentage: number;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    bookingReminders: boolean;
    reviewRequests: boolean;
  };
  general: {
    businessName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
} 