// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  monthlyStats: MonthlyStat[];
  customerSatisfaction: number;
}

export interface MonthlyStat {
  month: string;
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
  };
  general: {
    businessName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
} 