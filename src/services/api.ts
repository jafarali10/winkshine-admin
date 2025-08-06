// API service for connecting to the backend API
import { ApiResponse, User, DashboardStats, BusinessSettings } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to make API calls
const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = localStorage.getItem('adminToken');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.success && response.data) {
        // Store token in localStorage
        localStorage.setItem('adminToken', response.data.token);
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  },
  
  logout: async (): Promise<ApiResponse> => {
    localStorage.removeItem('adminToken');
    return { success: true };
  },
  
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiCall('/auth/me');
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user'
      };
    }
  },

  register: async (name: string, email: string, password: string, role: 'admin' | 'user' = 'user'): Promise<ApiResponse<{ token: string; user: User }>> => {
    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });
      
      if (response.success && response.data) {
        // Store token in localStorage
        localStorage.setItem('adminToken', response.data.token);
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  },
};

export const dashboardAPI = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      const response = await apiCall('/dashboard/stats');
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats'
      };
    }
  },
  
  getRecentActivity: async (): Promise<ApiResponse> => {
    try {
      const response = await apiCall('/dashboard/recent-activity');
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recent activity'
      };
    }
  },
};

export const usersAPI = {
  getAll: async (page = 1, limit = 10): Promise<ApiResponse<User[]>> => {
    try {
      const response = await apiCall(`/users?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users'
      };
    }
  },
  
  getRegularUsers: async (page = 1, limit = 10, search = '', status = 'all'): Promise<ApiResponse<User[]>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: search,
        status: status
      });
      const response = await apiCall(`/users/list/regular?${params.toString()}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch regular users'
      };
    }
  },
  
  getById: async (id: string): Promise<ApiResponse<User>> => {
    try {
      const response = await apiCall(`/users/${id}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user'
      };
    }
  },
  
  updateStatus: async (id: string, status: 'active' | 'inactive'): Promise<ApiResponse> => {
    try {
      const response = await apiCall(`/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user status'
      };
    }
  },
  
  updateRole: async (id: string, role: 'user' | 'admin'): Promise<ApiResponse> => {
    try {
      const response = await apiCall(`/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user role'
      };
    }
  },
  
  delete: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await apiCall(`/users/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete user'
      };
    }
  },
  
  bulkUpdateStatus: async (userIds: string[], status: 'active' | 'inactive'): Promise<ApiResponse> => {
    try {
      const response = await apiCall('/users/bulk/status', {
        method: 'PATCH',
        body: JSON.stringify({ userIds, status }),
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user statuses'
      };
    }
  },
  
  bulkDelete: async (userIds: string[]): Promise<ApiResponse> => {
    try {
      const response = await apiCall('/users/bulk', {
        method: 'DELETE',
        body: JSON.stringify({ userIds }),
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete users'
      };
    }
  },
  
  getStats: async (): Promise<ApiResponse> => {
    try {
      const response = await apiCall('/users/stats/overview');
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user statistics'
      };
    }
  },
  
  createUser: async (userData: { name: string; email: string; password: string; role?: 'user' | 'admin' }): Promise<ApiResponse<User>> => {
    try {
      const response = await apiCall('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user'
      };
    }
  },
  
  updateUser: async (id: string, userData: { name: string; email: string }): Promise<ApiResponse<User>> => {
    try {
      const response = await apiCall(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user'
      };
    }
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

export const logoAPI = {
  get: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await apiCall('/logo');
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch logo'
      };
    }
  },
  
  upload: async (formData: FormData): Promise<ApiResponse<any>> => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/logo/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload logo'
      };
    }
  },
}; 