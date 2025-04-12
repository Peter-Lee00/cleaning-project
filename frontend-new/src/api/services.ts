import { api } from './config';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'HOME_OWNER' | 'CLEANER' | 'USER' | 'ADMIN';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: 'HOME_OWNER' | 'CLEANER' | 'USER';
}

// Auth Services
export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/users/register', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

// User Services
export const userService = {
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.put('/users/me', data);
    return response.data;
  }
};

// Service Services
export const serviceService = {
  getAllServices: async () => {
    const response = await api.get('/services');
    return response.data;
  },

  getServiceById: async (id: string) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  createService: async (data: any) => {
    const response = await api.post('/services', data);
    return response.data;
  }
};

// Booking Services
export const bookingService = {
  getAllBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getBookingById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  createBooking: async (data: any) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  updateBookingStatus: async (id: string, status: string) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  }
}; 