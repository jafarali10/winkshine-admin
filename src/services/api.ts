// Simple API service without external dependencies for now
// This will be replaced with actual axios implementation when backend is ready

import { ApiResponse, User, Service, Booking, Review, DashboardStats, BusinessSettings } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Mock API functions for development
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    // Mock login - replace with actual API call
    if (email === 'admin@winkshine.com' && password === 'admin123') {
      return {
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: {
            _id: '1',
            name: 'Admin User',
            email: 'admin@winkshine.com',
            role: 'admin',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        }
      };
    }
    return {
      success: false,
      error: 'Invalid credentials'
    };
  },
  
  logout: async (): Promise<ApiResponse> => {
    return { success: true };
  },
  
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return {
      success: true,
      data: {
        _id: '1',
        name: 'Admin User',
        email: 'admin@winkshine.com',
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    };
  },
};

export const dashboardAPI = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return {
      success: true,
      data: {
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
      }
    };
  },
  
  getRecentActivity: async (): Promise<ApiResponse> => {
    return { success: true, data: [] };
  },
};

export const usersAPI = {
  getAll: async (page = 1, limit = 10): Promise<ApiResponse<User[]>> => {
    return { success: true, data: [] };
  },
  
  getById: async (id: string): Promise<ApiResponse<User>> => {
    return { success: true, data: {} as User };
  },
  
  updateStatus: async (id: string, status: boolean): Promise<ApiResponse> => {
    return { success: true };
  },
  
  updateRole: async (id: string, role: 'user' | 'admin'): Promise<ApiResponse> => {
    return { success: true };
  },
  
  delete: async (id: string): Promise<ApiResponse> => {
    return { success: true };
  },
};

export const servicesAPI = {
  getAll: async (page = 1, limit = 10): Promise<ApiResponse<Service[]>> => {
    return { success: true, data: [] };
  },
  
  getById: async (id: string): Promise<ApiResponse<Service>> => {
    return { success: true, data: {} as Service };
  },
  
  create: async (service: Omit<Service, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Service>> => {
    return { success: true, data: {} as Service };
  },
  
  update: async (id: string, service: Partial<Service>): Promise<ApiResponse<Service>> => {
    return { success: true, data: {} as Service };
  },
  
  updateStatus: async (id: string, status: boolean): Promise<ApiResponse> => {
    return { success: true };
  },
  
  delete: async (id: string): Promise<ApiResponse> => {
    return { success: true };
  },
  
  getStats: async (): Promise<ApiResponse> => {
    return { success: true, data: {} };
  },
};

export const bookingsAPI = {
  getAll: async (page = 1, limit = 10): Promise<ApiResponse<Booking[]>> => {
    return { success: true, data: [] };
  },
  
  getById: async (id: string): Promise<ApiResponse<Booking>> => {
    return { success: true, data: {} as Booking };
  },
  
  updateStatus: async (id: string, status: Booking['status']): Promise<ApiResponse> => {
    return { success: true };
  },
  
  delete: async (id: string): Promise<ApiResponse> => {
    return { success: true };
  },
  
  getPending: async (): Promise<ApiResponse<Booking[]>> => {
    return { success: true, data: [] };
  },
  
  getToday: async (): Promise<ApiResponse<Booking[]>> => {
    return { success: true, data: [] };
  },
  
  getStats: async (): Promise<ApiResponse> => {
    return { success: true, data: {} };
  },
};

export const reviewsAPI = {
  getAll: async (page = 1, limit = 10): Promise<ApiResponse<Review[]>> => {
    return { success: true, data: [] };
  },
  
  getById: async (id: string): Promise<ApiResponse<Review>> => {
    return { success: true, data: {} as Review };
  },
  
  updateStatus: async (id: string, status: 'approved' | 'hidden'): Promise<ApiResponse> => {
    return { success: true };
  },
  
  delete: async (id: string): Promise<ApiResponse> => {
    return { success: true };
  },
  
  getPending: async (): Promise<ApiResponse<Review[]>> => {
    return { success: true, data: [] };
  },
  
  getStats: async (): Promise<ApiResponse> => {
    return { success: true, data: {} };
  },
};

export const settingsAPI = {
  get: async (): Promise<ApiResponse<BusinessSettings>> => {
    return { success: true, data: {} as BusinessSettings };
  },
  
  update: async (settings: Partial<BusinessSettings>): Promise<ApiResponse> => {
    return { success: true };
  },
}; 